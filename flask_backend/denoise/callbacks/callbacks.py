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


class SocketIOWriterCallback(Callback):
    def __init__(self, socketio):
        super().__init__()
        self.socketio = socketio


class SocketIOTrainingCallback(SocketIOWriterCallback):
    def __init__(self, socketio):
        super().__init__(socketio)

    def on_epoch_begin(self, epoch, logs=None):
        
        pass

    def on_epoch_end(self, epoch, logs=None):

        pass
