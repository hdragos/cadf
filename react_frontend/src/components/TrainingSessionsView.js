import React, {Component} from 'react'
import {theme, httpAddress, listElementStyle, listContainerStyle, wsAddress} from "./Constants";
import {handleFormFileChange, handleFormTextChange} from "./Utils";
import io from 'socket.io-client'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

class SingleImagePredictionForm extends Component {
    constructor(props){
        super(props);
        this.state = {
          rawImage: null
        };

        this.handleFormFileChange = handleFormFileChange.bind(this);
    }

    handleSubmit = (event) => {
        const { rawImage } = this.state;
        const { trainingSessionId } = this.props

        let formData = new FormData();
        let metadataDict = {"type": "predict_single_image", "data": {"training_session_id": trainingSessionId}};
        formData.append('metadata', JSON.stringify(metadataDict));
        formData.append('image', rawImage);

        fetch(`${httpAddress}/predict_image`, {
            mode: 'no-cors',
            method: 'POST',
            body: formData
        })
        //TO DO: Handle responses accordingly
            .then((response) => {
                console.log(`Received response: ${response}`);
            })
            .catch((error) => {
                console.log("Error while fetching messages from the server. Reason: ", error)
            });

        event.preventDefault();
    };

    render() {
        return <form
            onSubmit={(event) => this.handleSubmit(event)}
            encType="multipart/form-data"
        >
            <input
                type="file"
                onChange={(event) => this.handleFormFileChange(event, 'rawImage')}
                name='rawImage'
            />

            <input type="submit" value="Submit"/>
        </form>
    }
}

class TrainingSessionView extends Component{
    constructor(props){
        super(props);
    }

    render() {
        const {trainingSession, handleRunTrainingSession, handleDeleteTrainingSession, socket} = this.props;

        return <div style={styles.trainingSessionView}>
            <p>TrainingSession ID: {trainingSession.id}</p>
            <p>TrainingSession name: {trainingSession.name}</p>
            <Button
                variant="primary"
                onClick={() => handleRunTrainingSession(socket, trainingSession.id)}>
                Run training session
            </Button>
            <Button
                variant="danger"
                onClick={() => handleDeleteTrainingSession(trainingSession.id)}>
                Delete training session
            </Button>
            <SingleImagePredictionForm
                trainingSessionId={trainingSession.id}
            />
        </div>
    }
}

class TrainingSessionForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            trainingSessionName: null,
            trainingSessionDescription: null,
            epochs: null,
            cleanDatasetId: null,
            noisyDatasetId: null,
            denoiserId: null,
            learningStrategyId: null,
        };

        this.handleFormTextChange = handleFormTextChange.bind(this);
        this.handleFormFileChange = handleFormFileChange.bind(this);
    }

    handleSubmit = (event) => {
        const { trainingSessionName, trainingSessionDescription, epochs, cleanDatasetId, noisyDatasetId, denoiserId, learningStrategyId } = this.state;

        let formData = new FormData();
        let metadataDict =
            {
                "type": "create_denoiser",
                "data": {
                    "name": trainingSessionName,
                    "description": trainingSessionDescription,
                    "epochs": parseInt(epochs, 10),
                    "clean_dataset_id": parseInt(cleanDatasetId, 10),
                    "noisy_dataset_id": parseInt(noisyDatasetId, 10),
                    "denoiser_id": parseInt(denoiserId, 10),
                    "learning_strategy_id": learningStrategyId,
                }
            };

        formData.append('metadata', JSON.stringify(metadataDict));

        fetch(`${httpAddress}/training_sessions`, {
            mode: 'no-cors',
            method: 'POST',
            body: formData
        })
        //TO DO: Handle responses accordingly
            .then((response) => {
                console.log(`Received response: ${response}`);
            })
            .catch((error) => {
                console.log("Error while fetching messages from the server. Reason: ", error)
            });
        event.preventDefault();
    };

    render() {

        return <Form onSubmit={(event) => this.handleSubmit(event)}>
            <Form.Group>
                <h1>Upload a new Training session:</h1>
                <Form.Label>Name:</Form.Label>
                <Form.Control
                    type="text"
                    value={this.state.trainingSessionName}
                    onChange={(event) => this.handleFormTextChange(event, 'trainingSessionName')}
                />
            </Form.Group>
            <Form.Group>

            <Form.Label>Description:</Form.Label>
                <Form.Control
                    type="text"
                    value={this.state.trainingSessionDescription}
                    onChange={(event) => this.handleFormTextChange(event, 'trainingSessionDescription')}
                />
            </Form.Group>

            <Form.Group>
                <Form.Label>Epochs:</Form.Label>
                <Form.Control
                    type="text"
                    value={this.state.epochs}
                    onChange={(event) => this.handleFormTextChange(event, 'epochs')}
                />
            </Form.Group>

            <Form.Group>
                <Form.Label>Clean dataset id:</Form.Label>
                <Form.Control
                    type="text"
                    value={this.state.cleanDatasetId}
                    onChange={(event) => this.handleFormTextChange(event, 'cleanDatasetId')}
                />
            </Form.Group>

            <Form.Group>
                <Form.Label>Noisy dataset id:</Form.Label>
                <Form.Control
                    type="text"
                    value={this.state.noisyDatasetId}
                    onChange={(event) => this.handleFormTextChange(event, 'noisyDatasetId')}
                />
            </Form.Group>

            <Form.Group>
                <Form.Label>Denoiser id:</Form.Label>
                <Form.Control
                    type="text"
                    value={this.state.denoiserId}
                    onChange={(event) => this.handleFormTextChange(event, 'denoiserId')}
                />
            </Form.Group>

            <Button  variant="primary" type="submit">
                Create training session
            </Button>
        </Form>
    }
}

class TrainingSessionsView extends Component{
    constructor(props){
        super(props);
    };

    componentDidMount() {
        console.log("TrainingSessionsView successfully mounted.");

        this.socket = io("http://127.0.0.1:5000");
        this.socket.on(
            'update_training_data',
            data => {console.log('Received data' + data + ' from the server!')}
        );
    }

    handleRunTrainingSession = (socket, trainingSessionId) => {
        socket.emit(
            'run_single_training_session',
            {
                'training_session_id': trainingSessionId
            })
    }
    
    handleDeleteTrainingSession = (trainingSessionId) => {
        fetch(`${httpAddress}/training_sessions/${trainingSessionId}`, {
            method: 'DELETE',
        })
        //TO DO: Handle responses accordingly
            .then((response) => {
                console.log(`Received response: ${response}`);
            })
            .catch((error) => {
                console.log("Error while fetching messages from the server. Reason: ", error)
            });
    }

    render() {
        const {training_sessions} = this.props;
        const socket = this.socket
        const handleRunTrainingSession = this.handleRunTrainingSession;
        const handleDeleteTrainingSession = this.handleDeleteTrainingSession;

        return <div>
            <ul style={styles.training_sessionsList}>
                {training_sessions.map(trainingSession => (
                    <TrainingSessionView
                        trainingSession={trainingSession}
                        handleRunTrainingSession={handleRunTrainingSession}
                        handleDeleteTrainingSession={handleDeleteTrainingSession}
                        socket={socket}
                    />
                ))}
            </ul>
            <div>
                <p>TrainingSession preview placeholder</p>
            </div>
            <div>
                <TrainingSessionForm/>
            </div>
        </div>
    }
}

export default TrainingSessionsView;

const styles = {
    trainingSessionView: listElementStyle,
    training_sessionsList: listContainerStyle,
    trainingSessionPreview: {
        backgroundColor: theme.light,
        display: 'block',
        float: 'left',
        width: '100%',
    }
};