import tensorflow as tf


class Layer(object):
    """
    Any class implementing the Layer interface must implement the following methods:
    create(input_data)
    validate()
    """
    pass


class Conv2D(Layer):
    def __init__(self, build_dict):
        self.filters = build_dict["filters"]
        self.kernel_size = build_dict["kernel_size"]
        self.activation = build_dict["activation"]
        self.padding = build_dict["padding"]
        self.data_format = build_dict["data_format"]

    def create(self, input_data):
        return tf.keras.layers.Conv2D(
            filters=self.filters,
            kernel_size=self.kernel_size,
            activation=self.activation,
            padding=self.padding,
            data_format=self.data_format
        )(input_data)

    def validate(self):
        """
        Validates the structure of the layer.
        :return:
        """
        pass


class MaxPooling2D(Layer):
    def __init__(self, build_dict):
        self.pool_size = build_dict["pool_size"]
        self.strides = build_dict["strides"]
        self.padding = build_dict["padding"]
        self.data_format = build_dict["data_format"]

    def create(self, input_data):
        return tf.keras.layers.MaxPool2D(
            pool_size=self.pool_size,
            strides=self.strides,
            padding=self.padding,
            data_format=self.data_format
        )(input_data)

    def validate(self):
        """
        Validates the structure of the layer.
        :return:
        """
        pass


class UpSampling2D(Layer):
    def __init__(self, build_dict):
        self.size = build_dict["size"]
        self.data_format = build_dict["data_format"]
        self.interpolation = build_dict["interpolation"]

    def create(self, input_data):
        return tf.keras.layers.UpSampling2D(
            size=self.size,
            data_format=self.data_format,
            interpolation=self.interpolation
        )(input_data)

    def validate(self):
        """
        Validates the structure of the layer.
        :return:
        """
        pass
