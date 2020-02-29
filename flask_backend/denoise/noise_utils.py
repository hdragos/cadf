import numpy as np


class NoiseGenerator(object):
    pass


class GaussianNoiseGenerator2D(NoiseGenerator):
    def __init__(self, build_dict):
        self.noise_sigma = build_dict['noise_sigma']
        pass

    def generate_noise(self, image):
        image = image + self.noise_sigma * np.random.normal(loc=0.0, scale=1.0, size=image.shape)
        image = np.clip(image, 0., 1.)
        return image


class SaltAndPepperNoiseGenerator2D(NoiseGenerator):
    def __init__(self, build_dict):
        pass

    def generate_noise(self, image):
        pass
