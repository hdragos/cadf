from __future__ import absolute_import, division, print_function, unicode_literals

import shutil
import hashlib
import json
import cv2
import os
import importlib
import numpy as np
from zipfile import ZipFile
import tensorflow as tf

from flask_backend.model import Denoiser, Dataset, TrainingSession, LearningStrategy


class MainService:
    def __init__(self, app, db, Dataset, Denoiser, TrainingSession):
        """
        The denoiser server service.
        :param app: Reference to the flask app
        :param db: Reference to the database
        :param Dataset: Reference to the dataset model
        :param Denoiser: Reference to the denoiser model
        :param TrainingSession: Reference to the training_session model
        """
        self.app = app
        self.TrainingSession = TrainingSession
        self.Denoiser = Denoiser
        self.Dataset = Dataset
        self.db = db

        self.DENOISERS_MODULE = 'flask_backend.denoise.autoencoder'

    @staticmethod
    def prepare_save_path(path):
        if not os.path.isdir(path):
            os.mkdir(path)

    @staticmethod
    def load_image_dataset(dataset: Dataset):
        image_dataset = []

        for archive_file in os.listdir(dataset.save_path):
            zip_path = os.path.join(dataset.save_path, archive_file)
            with ZipFile(zip_path, 'r') as dataset_archive:
                for filename in dataset_archive.namelist():
                    image_bytes = dataset_archive.read(filename)
                    np_array_image = np.fromstring(image_bytes, np.uint8)
                    image = cv2.imdecode(np_array_image, cv2.IMREAD_GRAYSCALE)
                    image_dataset.append(image)

        return image_dataset

    @staticmethod
    def reshape_for_training(image_array, input_shape):
        return np.array(image_array).reshape(tuple([len(image_array)] + input_shape))

    def create_denoiser(self, json_request):
        denoiser_save_path = os.path.join(self.app.config['DENOISERS'], json_request['data']['name'])
        self.prepare_save_path(denoiser_save_path)

        denoiser = self.Denoiser(
            name=json_request['data']['name'],
            description=json_request['data']['description'],
            trainable=json_request['data']['trainable'],
            structure=json.dumps(json_request['data']['structure']),
            save_path=os.path.join(denoiser_save_path, "{0}.json".format(json_request['data']['name']))
        )
        self.db.session.add(denoiser)
        with open(os.path.join(denoiser_save_path, "{0}.json".format(json_request['data']['name'])),
                  'w') as denoiser_structure_file:
            json.dump(json_request['data']['structure'], denoiser_structure_file)

        self.db.session.commit()

    def create_dataset(self, json_request, dataset_archive):
        dataset_save_path = os.path.join(self.app.config['DATASETS'], json_request['data']['name'])
        self.prepare_save_path(dataset_save_path)

        dataset = self.Dataset(
            name=json_request['data']['name'],
            description=json_request['data']['description'],
            save_path=dataset_save_path
        )
        self.db.session.add(dataset)

        dataset_archive.save(os.path.join(dataset_save_path, dataset_archive.filename))
        self.db.session.commit()

    def create_training_session(self, json_request):
        training_session_save_path = os.path.join(self.app.config['TRAINING_SESSIONS'], json_request['data']['name'])
        self.prepare_save_path(training_session_save_path)

        training_session = self.TrainingSession(
            name=json_request['data']['name'],
            epochs=json_request['data']['epochs'],
            clean_dataset_id=json_request['data']['clean_dataset_id'],
            noisy_dataset_id=json_request['data']['noisy_dataset_id'],
            denoiser_id=json_request['data']['denoiser_id'],
            learning_stategy_id=None,
            weights_save_path=os.path.join(training_session_save_path, json_request['data']['name'])
        )

        self.db.session.add(training_session)
        self.db.session.commit()

    def run_single_training_session(self, training_session_id):
        training_session = self.TrainingSession.query.get(training_session_id)

        clean_dataset = self.Dataset.query.get(training_session.clean_dataset_id)
        noisy_dataset = self.Dataset.query.get(training_session.noisy_dataset_id)
        trainable_denoiser = self.Denoiser.query.get(training_session.denoiser_id)

        self.run_training_session(
            training_session=training_session,
            clean_dataset=clean_dataset,
            noisy_dataset=noisy_dataset,
            trainable_denoiser=trainable_denoiser)

    def delete_training_session(self, training_session_id):
        training_session = self.TrainingSession.query.get(training_session_id)
        training_session_save_path = os.path.join(self.app.config['TRAINING_SESSIONS'], training_session.name)
        shutil.rmtree(training_session_save_path)
        self.db.session.delete(training_session)
        self.db.session.commit()

    def delete_dataset(self, dataset_id):
        dataset = self.Dataset.query.get(dataset_id)
        dataset_save_path = os.path.join(self.app.config['DATASETS'], dataset.name)
        shutil.rmtree(dataset_save_path)
        self.db.session.delete(dataset)
        self.db.session.commit()

    def delete_denoiser(self, denoiser_id):
        denoiser = self.Denoiser.query.get(denoiser_id)
        denoiser_save_path = os.path.join(self.app.config['DENOISERS'], denoiser.name)
        shutil.rmtree(denoiser_save_path)
        self.db.session.delete(denoiser)
        self.db.session.commit()

    def get_denoisers(self):
        denoisers = self.Denoiser.query.all()
        denoisers = [denoiser.as_dict() for denoiser in denoisers]
        return json.dumps(denoisers)

    def get_datasets(self):
        datasets = self.Dataset.query.all()
        datasets = [dataset.as_dict() for dataset in datasets]
        return json.dumps(datasets)

    def get_training_sessions(self):
        training_sessions = self.TrainingSession.query.all()
        training_sessions = [training_session.as_dict() for training_session in training_sessions]
        return json.dumps(training_sessions)

    def predict_dataset(self, json_request):
        training_session_id = json_request['data']['training_session_id']
        dataset_id = json_request['data']['dataset_id']

        training_session = TrainingSession.query.get(training_session_id)
        dataset = Dataset.query.get(dataset_id)
        denoiser = Denoiser.query.get(training_session.denoiser_id)

        self.run_prediction_dataset(
            training_session=training_session,
            dataset=dataset,
            denoiser=denoiser
        )

    def save_predicted_image(
            self,
            image,
            training_session: TrainingSession
    ):
        image_hash = hashlib.md5(image.tobytes()).hexdigest()
        image_path = os.path.join(self.app.config['TEMP'], '{0}_{1}.png'.format(training_session.name, image_hash))
        cv2.imwrite(image_path, image)
        return image_path

    def build_denoiser_object(
            self,
            trainable_denoiser: Denoiser
    ):
        with open(trainable_denoiser.save_path) as denoiser_structure_fp:
            # Build the denoiser in memory
            denoiser_structure_dict = json.load(denoiser_structure_fp)
            denoisers_module = importlib.import_module(self.DENOISERS_MODULE)
            denoiser_class = getattr(denoisers_module, denoiser_structure_dict['type'])
            denoiser_obj = denoiser_class(denoiser_structure_dict)

            return denoiser_obj

    def load_and_reshape_dataset(
            self,
            dataset: Dataset,
            input_shape
    ):
        dataset_images = self.load_image_dataset(dataset)
        dataset_images = self.reshape_for_training(dataset_images, input_shape)
        return dataset_images

    def predict_single_image(self, json_request, raw_image):
        training_session_id = json_request['data']['training_session_id']

        image_bytes = raw_image.read()
        np_array_image = np.fromstring(image_bytes, np.uint8)
        image = cv2.imdecode(np_array_image, cv2.IMREAD_GRAYSCALE)

        training_session = TrainingSession.query.get(training_session_id)
        denoiser = Denoiser.query.get(training_session.denoiser_id)

        print("Predict single image endpoint hit, with training session id {0}".format(training_session_id))
        return self.run_prediction_single(
            training_session,
            denoiser,
            image
        )

    def run_training_session(
            self,
            training_session: TrainingSession,
            clean_dataset: Dataset,
            noisy_dataset: Dataset,
            trainable_denoiser: Denoiser,
            leaning_strategy: LearningStrategy = None,
            custom_callbacks=None
    ):

        print("Num GPUs Available: ", len(tf.config.experimental.list_physical_devices('GPU')))

        if custom_callbacks is None:
            custom_callbacks = []

        if trainable_denoiser.trainable is not True:
            raise Exception("Denoiser {0} is untrainable!".format(trainable_denoiser))

        denoiser_obj = self.build_denoiser_object(trainable_denoiser)

        print("Successfully built the denoiser {0}".format(trainable_denoiser.name))

        # Load the clean dataset
        clean_dataset_images = self.load_and_reshape_dataset(clean_dataset, denoiser_obj.input_shape)

        # Load the noisy dataset
        noisy_dataset_images = self.load_and_reshape_dataset(noisy_dataset, denoiser_obj.input_shape)

        print("Successfully loaded datasets: {0} and {1}".format(clean_dataset.name, noisy_dataset.name))

        weights_save_path = training_session.weights_save_path
        denoiser_obj.train(
            training_input_data=noisy_dataset_images,
            training_output_data=clean_dataset_images,
            epochs=training_session.epochs,
            batch_size=1,
            save_path=weights_save_path,
            custom_callbacks=custom_callbacks
        )

        tf.keras.backend.clear_session()

    def run_prediction_single(self,
                              training_session: TrainingSession,
                              denoiser: Denoiser,
                              image):

        dataset_images = [image]

        print("Num GPUs Available: ", len(tf.config.experimental.list_physical_devices('GPU')))

        # Build the denoiser in memory
        denoiser_obj = self.build_denoiser_object(denoiser)

        dataset_images = self.reshape_for_training(dataset_images, denoiser_obj.input_shape)

        denoiser_obj.load(training_session.weights_save_path)
        predicted_image = denoiser_obj.predict(dataset_images)
        predicted_image = predicted_image.squeeze()

        tf.keras.backend.clear_session()

        return self.save_predicted_image(predicted_image, training_session)

    def run_prediction_dataset(
            self,
            training_session: TrainingSession,
            dataset: Dataset,
            denoiser: Denoiser
    ):

        print("Num GPUs Available: ", len(tf.config.experimental.list_physical_devices('GPU')))


        # Build the denoiser in memory
        denoiser_obj = self.build_denoiser_object(denoiser)

        # Load the dataset
        dataset_images = self.load_and_reshape_dataset(dataset, denoiser_obj.input_shape)

        denoiser_obj.load(training_session.weights_save_path)
        predicted_images = denoiser_obj.predict(dataset_images)

        tf.keras.backend.clear_session()
