# Convolutional autoencoder denoising framework

## What is this
CADF (Convolutional autoencoder denoising framework) is a web application that permits the denoising of images using
convolutional autencoders. It also can manage datasets and convolutional autoencoders.

This web application uses a client-server architecture.

## Installation

### Frontend
The client is written in Javascript using the React framework. The client is located in 
`/flask_backend/templates/index.html` but in order to further develop the client, the following commands need to be run.

```
cd react_frontend
npm install
npm run-script build
```


### Backend
The backend is written in Python using the Flask web framework and Keras (with Tensorflow backend) for the deep learning
part.

## Documentation

### Core concepts

The main concepts in the application are __Denoisers__, __Datasets__ and __Training sessions__.

A __Denoiser__ is a structure (in our case ) that takes as an input a noisy piece of data (in our case, an image) and outputs the same
piece of data but with the noise reduced or removed.

A __Dataset__ represents a collection of elements. In this application there are noisy and clean datasets. The name and
order of the elements in a dataset is important. Example: if DatasetA is a clean one and DatasetB is the noisy version of
DatasetA, then all elements in DatasetB will be copies of the elements in DatasetA, in the same order, just with added noise.

A __Training session__ represents the training status of a certain denoiser on a noisy dataset. A training epoch goes like this:
1) The clean and noisy pieces of data for the current batch are loaded.
2) The denoiser takes as input that many pieces of data as the batch size.
3) The denoiser outputs the required pieces of data (with potentially reduced/removed noise)
4) The output from the denoiser are compared with the clean (desired) outputs
5) The error is calculated between the actual output and the desired output.
6) The weights of the denoiser are updated accordingly.

As the epochs go on, the denoiser should reach a certain state where it can easily clear out most of the noise (in not all)
from a given piece of data. Pitfalls like overfitting are the jobs of the user to avoid (by choosing a balanced dataset
and the right hyperparameters for a training session and the denoiser).
 
The whole idea behind the application is to train denoisers on datasets with certain types of noise (most likely generated
noise that resembles real life noise) and to use the denoisers for clearing out the noise from other images.