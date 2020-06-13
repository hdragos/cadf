import numpy as np
import matplotlib.pyplot as plt

EPOCHS = 20
BATCH_SIZE = 5
TRAIN_SAMPLES = 5000
TEST_SAMPLES = 100
PLOT_SAMPLES = 10
GAUSSIAN_NOISE_SIGMA = 0.2
SAVE_FOLDER_NOISY = "mnist_noisy"
SAVE_FOLDER_CLEAN = "mnist_clean"


def comparison_plot(line_array, elements_per_line=5, val_min=0, val_max=255):
    number_of_lines = len(line_array)
    fig, axes = plt.subplots(number_of_lines, elements_per_line, figsize=(56, 56))

    plt.subplots_adjust(top=1.2)
    plt.gray()
    for i in range(number_of_lines):
        for j in range(elements_per_line):
            axes[i, j].set_axis_off()
            axes[i, j].imshow(np.array(line_array[i][j]).squeeze(), vmin=val_min, vmax=val_max)

    plt.savefig("plot.png", bbox_inches='tight')