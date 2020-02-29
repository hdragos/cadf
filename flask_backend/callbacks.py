import tensorflow as tf


class LoggerCallback(tf.keras.callbacks.Callback):
    def __init__(self):
        super().__init__()

    def on_train_begin(self, logs=None):
        print("Starting model training!")

    def on_train_end(self, logs=None):
        print("Ending model training!")

    def on_train_batch_begin(self, batch, logs=None):
        print("Working on a new batch!")
