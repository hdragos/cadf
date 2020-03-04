import React, {Component} from 'react'
import {theme, httpAddress, listElementStyle, listContainerStyle} from "./Constants";

class TrainingSessionView extends Component{
    constructor(props){
        super(props);
    }

    render() {
        const {trainingSession} = this.props;

        return <div style={styles.trainingSessionView}>
            <p>TrainingSession ID: {trainingSession.id}</p>
            <p>TrainingSession name: {trainingSession.name}</p>
            <button>Run training session</button>
        </div>
    }
}

class TrainingSessionForm extends Component {
    constructor(props){
        super(props);
        this.state = {
          trainingSessionName: null,
          trainingSessionDescription: null
        };
    }

    handleSubmit = (event) => {
        alert("Form submission!");
        event.preventDefault();
    };

    render() {

        return <form onSubmit={(event) => this.handleSubmit(event)}>
            <h1>Upload a new trainingSession:</h1>
            <label>Name:</label>
            <input
                type="text"
                value={this.state.trainingSessionName}
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