import React, {Component} from 'react'
import {theme} from "./Constants";
import DatasetsView from "./DatasetsView"
import DenoisersView from "./DenoisersView";
import TrainingSessionsView from "./TrainingSessionsView"
import Navbar from 'react-bootstrap/Navbar'
import {Nav} from "react-bootstrap";
import LogoComponent from "./LogoComponent";

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
                <Navbar bg="primary" variant="dark">
                    <Nav>
                        <Navbar.Brand>
                            <LogoComponent/>
                        </Navbar.Brand>
                        <Nav.Link
                            onClick={() => this.handleScreenChange("denoisers")}>
                            DENOISERS
                        </Nav.Link>

                        <Nav.Link
                            onClick={() => this.handleScreenChange("datasets")}>
                            DATASETS
                        </Nav.Link>

                        <Nav.Link
                            onClick={() => this.handleScreenChange("training_sessions")}>
                            TRAINING SESSIONS
                        </Nav.Link>
                    </Nav>

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