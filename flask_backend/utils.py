from tensorflow.examples.tutorials.mnist import input_data
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


def generate_mnist_dataset():
    mnist = input_data.read_data_sets("MNIST_data/", one_hot=True)

    mnist_train_images = [x.reshape(28, 28, 1) for x in mnist.train.images[:TRAIN_SAMPLES]]
    mnist_test_images = [x.reshape(28, 28, 1) for x in mnist.test.images[:TEST_SAMPLES]]

    mnist_train_images = np.array(mnist_train_images).reshape((TRAIN_SAMPLES, 28, 28, 1))
    mnist_test_images = np.array(mnist_test_images).reshape((TEST_SAMPLES, 28, 28, 1))

    gn_gen = GaussianNoiseGenerator2D(build_dict={"noise_sigma": 0.3})

    mnist_train_noisy_images = np.array([gn_gen.generate_noise(image) for image in mnist_train_images])
    mnist_test_noisy_images = np.array([gn_gen.generate_noise(image) for image in mnist_test_images])

    noisy_folder = os.path.join(os.getcwd(), "mnist_noisy")
    clean_folder = os.path.join(os.getcwd(), "mnist_clean")
    if not os.path.isdir(noisy_folder):
        os.mkdir(noisy_folder)
    if not os.path.isdir(clean_folder):
        os.mkdir(clean_folder)

    for i in range(len(mnist_train_noisy_images)):
        clean_image = rescale_to_given_range(mnist_train_images[i].squeeze())
        noisy_image = rescale_to_given_range(mnist_train_noisy_images[i].squeeze())

        cv2.imwrite(os.path.join(clean_folder, "mnist_{0}.png".format(i)), clean_image)
        cv2.imwrite(os.path.join(noisy_folder, "mnist_{0}.png".format(i)), noisy_image)

    shutil.make_archive("mnist_clean", 'zip', clean_folder)
    shutil.make_archive("mnist_noisy", 'zip', noisy_folder)
