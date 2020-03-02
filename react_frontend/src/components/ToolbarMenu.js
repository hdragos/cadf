import React, {Component} from 'react'
import {theme} from "./Constants";
import DatasetsView from "./DatasetsView"
import DenoisersView from "./DenoisersView";
import TrainingSessionsView from "./TrainingSessionsView"

class ToolbarMenu extends Component {
    constructor(props){
        super(props);
        this.fetchData = props.fetchData;
        this.state = {
            currentScreen: "home",
            denoisers: [],
            datasets: [],
            training_sessions: [],
        };
    }

    handleScreenChange = (resource) => {
        this.setState({currentScreen: resource});
        this.fetchData(resource)
    };

    render() {
        const {currentScreen, datasets, denoisers, training_sessions} = this.state;

        return (
            <div>
                <ul style={styles.toolbar}>
                    <li>
                        <button onClick={() => this.handleScreenChange("denoisers")}
                                style={styles.button}>DENOISERS</button>
                    </li>
                    <li>
                        <button onClick={() => this.handleScreenChange("datasets")}
                                style={styles.button}>DATASETS</button>
                    </li>
                    <li>
                        <button onClick={() => this.handleScreenChange("training_sessions")}
                                style={styles.button}>TRAINING SESSIONS</button>
                    </li>
                </ul>
                {(currentScreen === "datasets") && <DatasetsView datasets={datasets}/>}
                {(currentScreen === "denoisers") && <DenoisersView denoisers={denoisers}/>}
                {(currentScreen === "training_sessions" && <TrainingSessionsView training_sessions={training_sessions}/>)}
            </div>
        );
    }
}

const styles = {
    button: {
        fontSize: '12pt',
        fontFamily: 'Lucida Console',
        backgroundColor: theme.dark,
        borderRadius: '15px',
        width: '100%',
    },
    toolbar: {
        backgroundColor: theme.light,
        display: 'inline-flex',
        width: '100%',
        listStyleType: 'none',
        height: '100%',
    }
};

export default ToolbarMenu;