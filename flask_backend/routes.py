from flask import request, render_template
import json
import os

from flask_backend import db, app
from flask_backend.model import Denoiser, Dataset, LearningStrategy, TrainingSession

from flask_backend.services.main_service import MainService
import socketio


service = MainService(
    app=app,
    db=db,
    Denoiser=Denoiser,
    Dataset=Dataset,
    TrainingSession=TrainingSession
)


def prepare_save_path(path):
    if not os.path.isdir(path):
        os.mkdir(path)


@app.route('/', methods=['GET'])
@app.route('/index', methods=['GET'])
def handle_index():
    return render_template('index.html')


@app.route('/denoisers', methods=['POST'])
def create_denoiser():
    try:
        json_request = json.loads(request.form['metadata'])
        service.create_denoiser(json_request)

        return render_template('success.html')
    except Exception as exception:
        print(exception)
        pass

    return render_template('test_index.html')


@app.route('/datasets', methods=['POST'])
def create_dataset():

    try:
        dataset_archive = request.files['dataset']
        json_request = json.loads(request.form['metadata'])

        service.create_dataset(json_request, dataset_archive)

        return render_template('success.html')
    except Exception as exception:
        print(exception)
        pass

    return render_template('test_index.html')


@app.route('/learning_strategies', methods=['POST'])
def create_learning_strategy():
    try:
        json_request = json.loads(request.form['metadata'])

        learning_strategy_save_path = os.path.join(app.config['LEARNING_STRATEGIES'], json_request['data']['name'])
        prepare_save_path(learning_strategy_save_path)

        learning_strategy = LearningStrategy(
            name=json_request['data']['name'],
            description=json_request['data']['description'],
            save_path=learning_strategy_save_path
        )
        db.session.add(learning_strategy)
        with open(os.path.join(learning_strategy_save_path, "{0}.json".format(json_request['data']['name'])), 'w') as learning_strategy_structure_file:
            json.dump(json_request['data']['structure'], learning_strategy_structure_file)

        print("Successfully saved learning strategy {0} in file.".format(json_request['data']['name']))
        db.session.commit()

        return render_template('success.html')
    except Exception as exception:
        print(exception)
        pass

    return render_template('test_index.html')


@app.route('/datasets', methods=['GET'])
def preview_datasets():
    return service.get_datasets()


@app.route('/denoisers', methods=['GET'])
def preview_denoisers():
    return service.get_denoisers()


@app.route('/training_sessions', methods=['GET'])
def preview_training_sessions():
    return service.get_training_sessions()


@app.route('/datasets/<dataset_name>', methods=['GET'])
def preview_dataset(dataset_name):
    pass


@app.route('/training_sessions/<training_session_id>', methods=['DELETE'])
def delete_training_session(training_session_id):
    try:
        service.delete_training_session(training_session_id)
        return render_template('success.html')

    except Exception as exception:
        print(exception)
        pass

    return render_template('test_index.html')

    pass


@app.route('/training_sessions/run/<training_session_id>', methods=['GET', 'POST'])
def run_single_training_session(training_session_id):
    try:
        service.run_single_training_session(training_session_id)
        return render_template('success.html')

    except Exception as exception:
        print(exception)
        pass

    return render_template('test_index.html')


@app.route('/training_sessions', methods=['POST'])
def create_training_session():
    try:
        json_request = json.loads(request.form['metadata'])
        service.create_training_session(json_request)

        return render_template('success.html')
    except Exception as exception:
        print(exception)
        pass

    return render_template('test_index.html')


@app.route('/predict_dataset', methods=['GET', 'POST'])
def predict_dataset():
    try:
        json_request = json.loads(request.form['metadata'])
        service.predict_dataset(json_request)

        return render_template('success.html')
    except Exception as exception:
        print(exception)
        pass

    return render_template('test_index.html')
