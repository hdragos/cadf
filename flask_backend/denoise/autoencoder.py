import numpy as np
import tensorflow as tf
from tensorflow.examples.tutorials.mnist import input_data
import matplotlib.pyplot as plt

from flask_backend.denoise.denoiser import ConvolutionalAutoencoderDenoiser
from flask_backend.denoise.noise_utils import GaussianNoiseGenerator2D
import importlib

# Debug variables
EPOCHS = 20
BATCH_SIZE = 5
TRAIN_SAMPLES = 3000
TEST_SAMPLES = 100
PLOT_SAMPLES = 10
GAUSSIAN_NOISE_SIGMA = 0.2
SAVE_PATH = "checkpoint_test/cp.ckpt"


class Convolutional2DAutoencoder:
    def __init__(self, build_dict):
        '''
        input_shape = build_dict["input_shape"],
        encoder_layers = build_dict['encoder_layers'],
        decoder_layers = build_dict['decoder_layers'],
        optimizer = build_dict["optimizer"],
        loss_function = build_dict["loss_function"]
        '''

        self.input_shape = build_dict["input_shape"]

        self.encoder_layers = self.__process_layer_dicts(build_dict['encoder_layers'])
        self.decoder_layers = self.__process_layer_dicts(build_dict['decoder_layers'])

        self.input_img = tf.keras.layers.Input(shape=tuple(build_dict['input_shape']))

        self.x = None
        for i in range(len(self.encoder_layers)):
            encoder_layer = self.encoder_layers[i]
            if i == 0:
                self.x = encoder_layer.create(self.input_img)
            elif i == len(self.encoder_layers) - 1:
                self.encoded = encoder_layer.create(self.x)
            else:
                self.x = encoder_layer.create(self.x)

        for i in range(len(self.decoder_layers)):
            decoder_layer = self.decoder_layers[i]
            if i == 0:
                self.x = decoder_layer.create(self.encoded)
            elif i == len(self.decoder_layers) - 1:
                self.decoded = decoder_layer.create(self.x)
            else:
                self.x = decoder_layer.create(self.x)

        self.autoencoder = tf.keras.models.Model(self.input_img, self.decoded)

        self.autoencoder.compile(
            optimizer=build_dict['optimizer'],
            loss=build_dict['loss_function']
        )

    @staticmethod
    def __process_layer_dicts(layer_dicts):
        layers_module = importlib.import_module("flask_backend.denoise.layers")
        layers = []
        for layer_dict in layer_dicts:
            layer_class = getattr(layers_module, layer_dict["type"])
            layers.append(layer_class(layer_dict))
        return layers

    def train(self, training_input_data, training_output_data, epochs=20, batch_size=1, save_path=None, custom_callbacks=None):
        """
        Run a training session with the given parameters.
        :param training_input_data: a list of images representing the input data
        :param training_output_data: a list of images representing the desired output data
        :param epochs: number of trainng epochs
        :param batch_size: the size of the batch
        :param save_path: the path where the model checkpoint will be saved
        :param custom_callbacks: a list of callbacks
        :return: None
        """
        if save_path is None:
            raise ValueError("Save path cannot be none!")

        checkpoint_callback = tf.keras.callbacks.ModelCheckpoint(filepath=save_path,
                                                                 save_weights_only=True,
                                                                 verbose=1)

        self.autoencoder.fit(x=training_input_data,
                             y=training_output_data,
                             epochs=epochs,
                             batch_size=batch_size,
                             shuffle=True,
                             callbacks=[checkpoint_callback] + custom_callbacks)

    def predict(self, input_data):
        """
        Run the autoencoder prediction on a given set of input data
        :param input_data: A list of images to run the prediction on
        :return: A list of images with the predicted data
        """
        return self.autoencoder.predict(input_data)

    def load(self, load_path=None):
        if load_path is None:
            raise ValueError("Load path cannot be None!")

        self.autoencoder.load_weights(load_path)

