from flask import Flask

import os

from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

app = Flask(__name__)

APP_DBNAME = 'DenoisingServer'

basedir = os.path.abspath(os.path.dirname(__file__))
app.config.from_mapping(
    SECRET_KEY='dev',
    SQLALCHEMY_DATABASE_URI=os.environ.get("C:\\sqlite\\databases\\flask.db") or 'sqlite:///' + os.path.join(basedir, APP_DBNAME + '.db'),
    SQLALCHEMY_TRACK_MODIFICATION=False,
)

db = SQLAlchemy(app)
migrate = Migrate(app, db)

app.config['DATA_FOLDER'] = 'D:\\University\\DenoisingDegree\\flask_backend\\static'
data_folders = ['DENOISERS', 'DATASETS', 'TRAINING_SESSIONS', 'LEARNING_STRATEGIES']
for folder in data_folders:
    full_folder_path = os.path.join(app.config['DATA_FOLDER'], folder)
    if not os.path.isdir(full_folder_path):
        os.mkdir(full_folder_path)
    app.config[folder] = full_folder_path

from flask_backend import routes, model


app.run(debug=True)
