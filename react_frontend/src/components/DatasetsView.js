import React, {Component} from 'react'
import {theme, httpAddress, listElementStyle, listContainerStyle} from "./Constants";
import {handleFormTextChange, handleFormFileChange} from "./Utils";
import Form from 'react-bootstrap/Form'
import Button from "react-bootstrap/Button";
import {Col, Container, ListGroup, Row} from "react-bootstrap";


class DatasetView extends Component{
    constructor(props){
        super(props);
    }

    render() {
        const {dataset} = this.props;

        return <Container style={styles.datasetView}>
            <Row>
                <p>Dataset ID: {dataset.id}</p>
            </Row>
            <Row>
                <p>Dataset name: {dataset.name}</p>
            </Row>
            <Row>
                <p>Dataset description: {dataset.description}</p>
            </Row>
            <Row>
                <Button
                    variant="primary">
                    Download dataset
                </Button>
            </Row>
            <Row>
                <Button
                    variant="danger">
                    Delete dataset
                </Button>
            </Row>
        </Container>
    }
}

class DatasetForm extends Component {
    constructor(props){
        super(props);
        this.state = {
          datasetName: null,
          datasetDescription: null,
          datasetArchive: null
        };

        this.handleFormFileChange = handleFormFileChange.bind(this);
        this.handleFormTextChange = handleFormTextChange.bind(this);
    }

    handleSubmit = (event) => {
        const { datasetName, datasetDescription, datasetArchive } = this.state;

        let formData = new FormData();
        let metadataDict = {"type": "create_dataset", "data": {"name": datasetName, "description": datasetDescription}};
        formData.append('metadata', JSON.stringify(metadataDict));
        formData.append('dataset', datasetArchive);

        fetch(`${httpAddress}/datasets`, {
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

        return <Form
            onSubmit={(event) => this.handleSubmit(event)}
            encType="multipart/form-data"
        >
            <h1>Upload a new dataset:</h1>
            <Form.Group>
                <Form.Label>Name:</Form.Label>
                <Form.Control
                    type="text"
                    value={this.state.datasetName}
                    onChange={(event) => this.handleFormTextChange(event, 'datasetName')}
                />
            </Form.Group>

            <Form.Group>
                <Form.Label>Description:</Form.Label>
                <Form.Control
                    type="text"
                    value={this.state.datasetDescription}
                    onChange={(event) => this.handleFormTextChange(event, 'datasetDescription')}
                />
            </Form.Group>

            <Form.Group>
                <Form.Label>Dataset archive:</Form.Label>
                <Form.Control
                    type="file"
                    onChange={(event) => this.handleFormFileChange(event, 'datasetArchive')}
                    name='datasetArchive'
                />
            </Form.Group>

            <Button  variant="primary" type="submit">
                Create dataset
            </Button>
        </Form>
    }
}

class DatasetsListView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {datasets} = this.props;

        return<ListGroup>
            {datasets.map(dataset =>
                (<ListGroup.Item>
                    <DatasetView dataset={dataset}/>
                </ListGroup.Item>))
            }
        </ListGroup>
    }
}

class DatasetsView extends Component{
    constructor(props){
        super(props);
    };

    componentDidMount() {
        console.log("DatasetsView successfully mounted.");
    }

    render() {
        const {datasets} = this.props;

        return <Container fluid="lg">
            <Row>
                <Col>
                    <DatasetsListView
                        datasets={datasets}
                    />
                </Col>
                <Col>
                    <DatasetForm/>
                </Col>
            </Row>
        </Container>
    }
}

export default DatasetsView;

const styles = {
    datasetView: listElementStyle,
    datasetsList: listContainerStyle,
    datasetPreview: {
        backgroundColor: theme.light,
        display: 'block',
        float: 'left',
        width: '100%',
    }
};