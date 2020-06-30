import React, {Component} from 'react'
import {theme, httpAddress, listElementStyle, listContainerStyle, wsAddress} from "./Constants";
import {downloadBinaryData, handleFormFileChange, handleFormTextChange} from "./Utils";
import io from 'socket.io-client'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import {Col, Container, ListGroup, Row, Spinner} from "react-bootstrap";

class SingleImagePredictionForm extends Component {
    constructor(props){
        super(props);
        this.state = {
          rawImage: null,
          isLoading: false
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

        this.setState({isLoading: true});

        fetch(`${httpAddress}/predict_image`, {
            mode: 'no-cors',
            method: 'POST',
            body: formData
        })
            .then((response) => response.blob())
            .then((blob) => {
                downloadBinaryData(blob, 'png', 'denoised_image')

                this.setState({isLoading: false});

            })
            .catch((error) => {
                console.log("Error while fetching messages from the server. Reason: ", error)
                this.setState({isLoading: false});
            });

        event.preventDefault();
    };

    render() {
        const { isLoading } = this.state;

        return <Form
            onSubmit={(event) => this.handleSubmit(event)}
            encType="multipart/form-data"
        >

            <Form.Row>
                <Form.Group>
                    <Form.Control
                        type="file"
                        onChange={(event) => this.handleFormFileChange(event, 'rawImage')}
                        name='rawImage'
                    />
                </Form.Group>

                <Button  variant="primary" type="submit">
                    {isLoading ?
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        /> :
                        "Denoise Image"
                    }
                </Button>
            </Form.Row>

        </Form>
    }
}

class TrainingSessionView extends Component{
    constructor(props){
        super(props);
    }

    render() {
        const {trainingSession, handleRunTrainingSession, handleDeleteTrainingSession, socket} = this.props;

        return <Container style={styles.trainingSessionView}>
            <Row>
                <p>TrainingSession ID: {trainingSession.id}</p>
            </Row>
            <Row>
                <p>TrainingSession name: {trainingSession.name}</p>
            </Row>
            <Row>
                <p>Completed epochs: {trainingSession.completed_epochs} out of {trainingSession.epochs}</p>
            </Row>
            <Row>
                <p>Last loss: {trainingSession.last_loss}</p>
            </Row>
            <Row>
                <Button
                    variant="primary"
                    onClick={() => handleRunTrainingSession(socket, trainingSession.id)}>
                    Run training session
                </Button>
            </Row>
            <Row>
                <Button
                    variant="danger"
                    onClick={() => handleDeleteTrainingSession(trainingSession.id)}>
                    Delete training session
                </Button>
            </Row>
            <Row>
                <SingleImagePredictionForm
                    trainingSessionId={trainingSession.id}
                />
            </Row>
        </Container>
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
                <h1>Create a new training session:</h1>
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

class TrainingSessionsListView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {training_sessions, socket, handleRunTrainingSession, handleDeleteTrainingSession} = this.props;

        return<ListGroup>
            {training_sessions.map(trainingSession => (
                    <ListGroup.Item>
                        <TrainingSessionView
                            trainingSession={trainingSession}
                            handleRunTrainingSession={handleRunTrainingSession}
                            handleDeleteTrainingSession={handleDeleteTrainingSession}
                            socket={socket}
                        />
                    </ListGroup.Item>
                ))}
        </ListGroup>
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
        const {fetchData} = this.props;

        fetch(`${httpAddress}/training_sessions/${trainingSessionId}`, {
            method: 'DELETE',
        })
        //TO DO: Handle responses accordingly
            .then((response) => {
                console.log(`Received response: ${response}`);
                fetchData('training_sessions');
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

        return <Container fluid="lg">
            <Row>
                <Col>
                    <TrainingSessionsListView
                        training_sessions={training_sessions}
                        socket={socket}
                        handleRunTrainingSession={handleRunTrainingSession}
                        handleDeleteTrainingSession={handleDeleteTrainingSession}
                    />
                </Col>
                <Col>
                    <TrainingSessionForm/>
                </Col>
            </Row>
        </Container>
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