import json

from tensorflow.keras.callbacks import Callback


class LoggerCallback(Callback):
    def __init__(self):
        super().__init__()

    def on_train_begin(self, logs=None):
        print("Starting model training!")

    def on_train_end(self, logs=None):
        print("Ending model training!")

    def on_train_batch_begin(self, batch, logs=None):
        print("Working on a new batch!")


class SocketIOTrainingCallback(Callback):
    def __init__(self, socket):
        super().__init__()
        self.socket = socket

    def on_epoch_end(self, epoch, logs=None):
        socket_response_dict = {'epoch': epoch, 'loss': logs['loss']}
        print('Sending {0} back to client...'.format(socket_response_dict))
        self.socket.emit('update_training_data', json.dumps(socket_response_dict))


class TrainingSessionUpdaterCallback(Callback):
    def __init__(self, training_session_id, training_session_model, db):
        super().__init__()
        self.training_session_id = training_session_id
        self.training_session_model = training_session_model
        self.db = db

    def on_epoch_end(self, epoch, logs=None):
        training_session = self.training_session_model.query.get(self.training_session_id)
        training_session.completed_epochs = epoch + 1
        training_session.last_loss = logs['loss']
        self.db.session.add(training_session)
        self.db.session.commit()
        print('Update training session {0} to epoch {1} with loss {2}'.format(
            training_session.id,
            epoch+1,
            logs['loss'])
        )
