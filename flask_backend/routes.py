from flask import jsonify, request, render_template, send_file
import json

from flask_backend import db, app, socketio

from flask_backend.model import Denoiser, Dataset, TrainingSession
from flask_backend.services.main_service import MainService
from flask_backend.exceptions import ExceptionResponse

service = MainService(
    app=app,
    db=db,
    Denoiser=Denoiser,
    Dataset=Dataset,
    TrainingSession=TrainingSession
)


@app.errorhandler(ExceptionResponse)
def handle_invalid_usage(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response


@app.route('/', methods=['GET'])
@app.route('/index', methods=['GET'])
def handle_index():
    return render_template('index.html')


@app.route('/download/denoisers/<denoiser_id>', methods=['GET'])
def downlaod_denoiser(denoiser_id):
    try:
        denoiser_path = service.download_denoiser(denoiser_id)
        return send_file(denoiser_path)
    except Exception as exception:
        print(exception)
        raise ExceptionResponse(message=str(exception))


@app.route('/download/datasets/<dataset_id>', methods=['GET'])
def download_dataset(dataset_id):
    try:
        dataset_path = service.download_dataset(dataset_id)
        return send_file(dataset_path)
    except Exception as exception:
        print(exception)
        raise ExceptionResponse(message=str(exception))


@app.route('/denoisers', methods=['POST'])
def create_denoiser():
    try:
        json_request = json.loads(request.form['metadata'])
        service.create_denoiser(json_request)

        return render_template('success.html')
    except Exception as exception:
        print(exception)
        raise ExceptionResponse(message=str(exception))


@app.route('/datasets', methods=['POST'])
def create_dataset():

    try:
        dataset_archive = request.files['dataset']
        json_request = json.loads(request.form['metadata'])

        service.create_dataset(json_request, dataset_archive)

        return render_template('success.html')
    except Exception as exception:
        print(exception)
        raise ExceptionResponse(message=str(exception))


@app.route('/datasets', methods=['GET'])
def preview_datasets():
    return service.get_datasets()


@app.route('/denoisers', methods=['GET'])
def preview_denoisers():
    return service.get_denoisers()


@app.route('/training_sessions', methods=['GET'])
def preview_training_sessions():
    return service.get_training_sessions()


@app.route('/training_sessions/<training_session_id>', methods=['DELETE'])
def delete_training_session(training_session_id):
    try:
        service.delete_training_session(training_session_id)
        return render_template('success.html')

    except Exception as exception:
        print(exception)
        raise ExceptionResponse(message=str(exception))


@app.route('/datasets/<dataset_id>', methods=['DELETE'])
def delete_dataset(dataset_id):
    try:
        service.delete_dataset(dataset_id)
        return render_template('success.html')

    except Exception as exception:
        print(exception)
        raise ExceptionResponse(message=str(exception))


@app.route('/denoisers/<denoiser_id>', methods=['DELETE'])
def delete_denoiser(denoiser_id):
    try:
        service.delete_denoiser(denoiser_id)
        return render_template('success.html')

    except Exception as exception:
        print(exception)
        raise ExceptionResponse(message=str(exception))


@socketio.on('run_single_training_session')
def handle_single_training_session(json_request):
    try:

        print("Received a socket.io event with the data={0}".format(json_request))

        training_session_id = json_request['training_session_id']
        service.run_single_training_session(training_session_id)
        socketio.emit('update_training_data', 'Hey pal, update your UI!')
        return render_template('success.html')

    except Exception as exception:
        print(exception)
        raise ExceptionResponse(message=str(exception))


@app.route('/training_sessions/run/<training_session_id>', methods=['GET', 'POST'])
def run_single_training_session(training_session_id):
    try:
        service.run_single_training_session(training_session_id)
        return render_template('success.html')

    except Exception as exception:
        print(exception)
        raise ExceptionResponse(message=str(exception))


@app.route('/training_sessions', methods=['POST'])
def create_training_session():
    try:
        json_request = json.loads(request.form['metadata'])
        service.create_training_session(json_request)

        return render_template('success.html')
    except Exception as exception:
        print(exception)
        raise ExceptionResponse(message=str(exception))


@app.route('/predict_dataset', methods=['GET', 'POST'])
def predict_dataset():
    try:
        json_request = json.loads(request.form['metadata'])
        service.predict_dataset(json_request)

        return render_template('success.html')
    except Exception as exception:
        print(exception)
        raise ExceptionResponse(message=str(exception))


@app.route('/predict_image', methods=['GET', 'POST'])
def predict_image():
    try:
        raw_image = request.files['image']
        json_request = json.loads(request.form['metadata'])
        image_path = service.predict_single_image(json_request, raw_image)

        return send_file(image_path)

    except Exception as exception:
        print(exception)
        raise ExceptionResponse(message=str(exception))
