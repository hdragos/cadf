import React, {Component} from 'react'
import {theme, httpAddress, listElementStyle, listContainerStyle} from "./Constants";
import {handleFormTextChange, handleFormFileChange} from "./Utils";
import Form from 'react-bootstrap/Form'
import Button from "react-bootstrap/Button";


class DatasetView extends Component{
    constructor(props){
        super(props);
    }

    render() {
        const {dataset} = this.props;

        return <div style={styles.datasetView}>
            <p>Dataset ID: {dataset.id}</p>
            <p>Dataset name: {dataset.name}</p>
        </div>
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
            style={styles.datasetPreview}
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

class DatasetsView extends Component{
    constructor(props){
        super(props);
    };

    componentDidMount() {
        console.log("DatasetsView successfully mounted.");
    }

    render() {
        const {datasets} = this.props;

        return <div>
            <ul style={styles.datasetsList}>
                {datasets.map(dataset => (
                    <DatasetView
                        dataset={dataset}
                    />
                ))}
            </ul>
            <div>
                <p>Dataset preview placeholder</p>
            </div>
            <div>
                <DatasetForm/>
            </div>
        </div>
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