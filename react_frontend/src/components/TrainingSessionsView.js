import React, {Component} from 'react'
import {theme, httpAddress, listElementStyle, listContainerStyle, wsAddress} from "./Constants";
import {handleFormFileChange, handleFormFileContentChange, handleFormTextChange} from "./Utils";
import io from 'socket.io-client'

class TrainingSessionView extends Component{
    constructor(props){
        super(props);
    }

    componentDidMount() {
        this.socket = io("http://127.0.0.1:5000");
    }

    render() {
        const {trainingSession} = this.props;

        return <div style={styles.trainingSessionView}>
            <p>TrainingSession ID: {trainingSession.id}</p>
            <p>TrainingSession name: {trainingSession.name}</p>
            <button onClick={this.handleRunTrainignSession}>
                Run training session
            </button>
        </div>
    }

    handleRunTrainignSession = (event) => {
        const {trainingSession} = this.props;
        const socket = this.socket;

        socket.emit(
            'run_single_training_session',
            {
                'training_session_id': trainingSession.id
            })
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
        this.handleFormFileContentChange = handleFormFileContentChange.bind(this);
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

        return <form onSubmit={(event) => this.handleSubmit(event)}>
            <h1>Upload a new Training session:</h1>
            <label>Name:</label>
            <input
                type="text"
                value={this.state.trainingSessionName}
                onChange={(event) => this.handleFormTextChange(event, 'trainingSessionName')}
            />
            <label>Description:</label>
            <input
                type="text"
                value={this.state.trainingSessionDescription}
                onChange={(event) => this.handleFormTextChange(event, 'trainingSessionDescription')}
            />
            <label>Epochs:</label>
            <input
                type="text"
                value={this.state.epochs}
                onChange={(event) => this.handleFormTextChange(event, 'epochs')}
            />
            <label>Clean dataset id:</label>
            <input
                type="text"
                value={this.state.cleanDatasetId}
                onChange={(event) => this.handleFormTextChange(event, 'cleanDatasetId')}
            />
            <label>Noisy dataset id:</label>
            <input
                type="text"
                value={this.state.noisyDatasetId}
                onChange={(event) => this.handleFormTextChange(event, 'noisyDatasetId')}
            />
            <label>Denoiser id:</label>
            <input
                type="text"
                value={this.state.denoiserId}
                onChange={(event) => this.handleFormTextChange(event, 'denoiserId')}
            />

            <input type="submit" value="Submit"/>
        </form>
    }
}

class TrainingSessionsView extends Component{
    constructor(props){
        super(props);
    };

    componentDidMount() {
        console.log("TrainingSessionsView successfully mounted.");
    }

    render() {
        const {training_sessions} = this.props;

        return <div>
            <ul style={styles.training_sessionsList}>
                {training_sessions.map(trainingSession => (
                    <TrainingSessionView
                        trainingSession={trainingSession}
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