import zipfile
from flask_backend.denoise.noise_utils import GaussianNoiseGenerator2D
import numpy as np
import os
import cv2
import matplotlib.pyplot as plt
from matplotlib.image import imsave
from zipfile import ZipFile
import shutil

EPOCHS = 20
BATCH_SIZE = 5
TRAIN_SAMPLES = 5000
TEST_SAMPLES = 100
PLOT_SAMPLES = 10
GAUSSIAN_NOISE_SIGMA = 0.2
SAVE_FOLDER_NOISY = "mnist_noisy"
SAVE_FOLDER_CLEAN = "mnist_clean"


def comparison_plot(line_array, elements_per_line=5):
    number_of_lines = len(line_array)

    for i in range(number_of_lines):
        for j in range(elements_per_line):
            index = j + i*elements_per_line + 1
            ax = plt.subplot(number_of_lines, elements_per_line, index)
            ax.set_axis_off()
            plt.imshow(np.array(line_array[i][j]).squeeze())
            plt.gray()

    plt.savefig("plot.png")


def rescale_to_given_range(image, max_new=255, min_new=0):
    min_val = np.amin(image)
    max_val = np.amax(image)

    image = image * max_new
    image = image / max_val

    return image