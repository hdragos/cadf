from flask_backend import db
from flask_backend import constants as ct
import json


class Denoiser(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(ct.NAME_LEN), unique=True, index=True)
    description = db.Column(db.String(ct.DESCRIPTION_LEN))
    structure = db.Column(db.String(ct.STRING_MAX_LEN))
    trainable = db.Column(db.Boolean)
    save_path = db.Column(db.String(ct.SAVE_PATH_LEN))
    training_sessions = db.relationship('TrainingSession', backref='denoiser', lazy='dynamic')

    def __repr__(self):
        return "<Denoiser {0}>.".format(
            str(self.id) + ";;" + self.name + ";;" + self.description + ";;" + str(self.trainable)
        )

    def as_dict(self):
        denoiser_dict = {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'structure': json.loads(self.structure)
        }

        return denoiser_dict


class Dataset(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(ct.NAME_LEN), unique=True, index=True)
    description = db.Column(db.String(ct.DESCRIPTION_LEN))
    save_path = db.Column(db.String(ct.SAVE_PATH_LEN))
    # training_sessions = db.relationship('TrainingSession', backref='dataset', lazy='dynamic')

    def __repr__(self):
        return "<Dataset {0}>.".format(
            str(self.id) + ";;" + self.name + ";;" + self.description
        )

    def as_dict(self):
        dataset_dict = {
            'id': self.id,
            'name': self.name,
            'description': self.description
        }
        return dataset_dict


class NoiseGenerator(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(ct.NAME_LEN), unique=True, index=True)
    save_path = db.Column(db.String(ct.SAVE_PATH_LEN))

    def __repr__(self):
        return "<Dataset {0}>.".format(
            str(self.id) + ";;" + self.name
        )


class LearningStrategy(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(ct.NAME_LEN), unique=True, index=True)
    description = db.Column(db.String(ct.DESCRIPTION_LEN))
    save_path = db.Column(db.String(ct.SAVE_PATH_LEN))


class TrainingSession(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(ct.NAME_LEN), unique=True, index=True)
    weights_save_path = db.Column(db.String(ct.SAVE_PATH_LEN))
    epochs = db.Column(db.Integer)
    clean_dataset_id = db.Column(db.Integer, db.ForeignKey("dataset.id"))
    noisy_dataset_id = db.Column(db.Integer, db.ForeignKey("dataset.id"))
    denoiser_id = db.Column(db.Integer, db.ForeignKey("denoiser.id"))
    learning_stategy_id = db.Column(db.Integer, db.ForeignKey("learning_strategy.id"), nullable=True)
    completed_epochs = db.Column(db.Integer, default=0)
    last_loss = db.Column(db.Float, default=2**30)

    def __repr__(self):
        return "<TrainingSession {0}>.".format(
            str(self.id) + ";;" + self.name + ";;" + str(self.epochs) + ";;" + str(self.clean_dataset_id) + ";;" + str(self.noisy_dataset_id) + ";;" + str(self.denoiser_id)
        )

    def as_dict(self):
        training_session_dict = {
            'id': self.id,
            'name': self.name,
            'epochs': self.epochs,
            'clean_dataset_id': self.clean_dataset_id,
            'noisy_dataset_id': self.noisy_dataset_id,
            'denoiser_id': self.denoiser_id,
            'completed_epochs': self.completed_epochs,
            'last_loss': self.last_loss
        }
        return training_session_dict
