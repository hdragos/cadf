import React, {Component} from 'react'
import {theme} from "./Constants";
import DatasetsView from "./DatasetsView"
import DenoisersView from "./DenoisersView";
import TrainingSessionsView from "./TrainingSessionsView"

class ToolbarMenu extends Component {
    constructor(props){
        super(props);
        this.state = {
            currentScreen: "HOME"
        };
    }

    handleScreenChange = (screenName) => {
        this.setState({currentScreen: screenName});
    };

    render() {
        const {currentScreen} = this.state;

        return (
            <div>
                <ul style={styles.toolbar}>
                    <li>
                        <button onClick={() => this.handleScreenChange("DENOISERS")}
                                style={styles.button}>DENOISERS</button>
                    </li>
                    <li>
                        <button onClick={() => this.handleScreenChange("DATASETS")}
                                style={styles.button}>DATASETS</button>
                    </li>
                    <li>
                        <button onClick={() => this.handleScreenChange("TRAINING SESSIONS")}
                                style={styles.button}>TRAINING SESSIONS</button>
                    </li>
                </ul>
                {(currentScreen === "DATASETS") && <DatasetsView/>}
                {(currentScreen === "DENOISERS") && <DenoisersView/>}
                {(currentScreen === "TRAINING SESSIONS" && <TrainingSessionsView/>)}
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