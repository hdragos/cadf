import React, {Component} from 'react'
import {theme} from "./Constants";
import DatasetsView from "./DatasetsView"
import DenoisersView from "./DenoisersView";
import TrainingSessionsView from "./TrainingSessionsView"
import Navbar from 'react-bootstrap/Navbar'
import NavbarLink from 'react-bootstrap/Navbar'
import { ReactComponent as AppIcon } from '../logo.svg';

class ToolbarMenu extends Component {
    constructor(props){
        super(props);
        this.fetchData = props.fetchData;
        this.state = {
            currentScreen: "home",
        };
    }

    handleScreenChange = (resource) => {
        this.setState({currentScreen: resource});
        this.fetchData(resource)
    };

    render() {
        const {currentScreen} = this.state;
        const {datasets, denoisers, training_sessions, fetchData} = this.props;

        return (
            <div>
                <Navbar style={styles.toolbar}>
                    <li>
                        <AppIcon
                            width="10%"
                            height="10%"
                            fill={theme.light}
                        />
                    </li>
                    <li>
                        <NavbarLink onClick={() => this.handleScreenChange("denoisers")}
                                style={styles.button}>DENOISERS</NavbarLink>
                    </li>
                    <li>
                        <NavbarLink onClick={() => this.handleScreenChange("datasets")}
                                style={styles.button}>DATASETS</NavbarLink>
                    </li>
                    <li>
                        <NavbarLink onClick={() => this.handleScreenChange("training_sessions")}
                                style={styles.button}>TRAINING SESSIONS</NavbarLink>
                    </li>
                </Navbar>
                {(currentScreen === "datasets") &&
                    <DatasetsView
                        datasets={datasets}
                    />}

                {(currentScreen === "denoisers") &&
                    <DenoisersView
                        denoisers={denoisers}
                    />}

                {(currentScreen === "training_sessions" &&
                    <TrainingSessionsView
                        training_sessions={training_sessions}
                        fetchData={fetchData}
                    />)}
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