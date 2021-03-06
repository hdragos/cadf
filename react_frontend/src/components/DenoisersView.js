import React, {Component} from 'react'
import {theme, httpAddress, listElementStyle, listContainerStyle} from "./Constants";
import {handleFormFileChange, handleFormTextChange, handleFormFileContentChange, downloadBinaryData} from "./Utils";
import Form from 'react-bootstrap/Form'
import Button from "react-bootstrap/Button";
import {Col, Container, ListGroup, Row, Spinner} from "react-bootstrap";

class DenoiserView extends Component{
    downloadDenoiser = () => {
        const {denoiser} = this.props;
        this.setState({isLoading: true});

        fetch(`${httpAddress}/download/denoisers/${denoiser.id}`, {
            mode: 'no-cors',
            method: 'GET',
        })
            .then((response) => response.blob())
            .then((blob) => {
                downloadBinaryData(blob, 'json', `${denoiser.name}`)

                this.setState({isLoading: false});

            })
            .catch((error) => {
                console.log("Error while fetching messages from the server. Reason: ", error)
                this.setState({isLoading: false});
            });
    };

    constructor(props){
        super(props);

        this.state = {
            isLoading: false,
        }
    }

    render() {
        const {denoiser} = this.props;
        const {isLoading} = this.state;

        return <Container style={styles.denoiserView}>
            <Row>
                <p>Denoiser ID: {denoiser.id}</p>
            </Row>
            <Row>
                <p>Denoiser name: {denoiser.name}</p>
            </Row>
            <Row>
                <p>Denoiser description: {denoiser.description}</p>
            </Row>
            <Row>
                <Button  variant="primary" type="submit" onClick={()=>this.downloadDenoiser()}>
                    {isLoading ?
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        /> :
                        "Download denoiser"
                    }
                </Button>
            </Row>
            <Row>
                <Button
                    variant="danger">
                    Delete denoiser
                </Button>
            </Row>
        </Container>
    }
}


class DenoiserForm extends Component {

    constructor(props){
        super(props);
        this.state = {
            denoiserName: null,
            denoiserDescription: null,
            denoiserTrainable: true,
            denoiserStructureFile: null,
            denoiserStructure: null,
            fileReader: new FileReader(),
        };

        this.handleFormTextChange = handleFormTextChange.bind(this);
        this.handleFormFileChange = handleFormFileChange.bind(this);
        this.handleFormFileContentChange = handleFormFileContentChange.bind(this);
    }

    handleSubmit = (event) => {
        const { denoiserName, denoiserDescription, denoiserTrainable, denoiserStructure } = this.state;
        let structure = JSON.parse(denoiserStructure);

        let formData = new FormData();
        let metadataDict =
            {
                "type": "create_denoiser",
                "data": {
                    "name": denoiserName,
                    "description": denoiserDescription,
                    "trainable": denoiserTrainable,
                    structure
                }
            };

        formData.append('metadata', JSON.stringify(metadataDict));

        fetch(`${httpAddress}/denoisers`, {
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
        const {fileReader} = this.state;

        return <Form onSubmit={(event) => this.handleSubmit(event)}
            encType="multipart/form-data"
            >


            <Form.Group>
                <h1>Upload a new denoiser:</h1>
                <Form.Label>Name:</Form.Label>
                <Form.Control
                    type="text"
                    value={this.state.denoiserName}
                    onChange={(event) => this.handleFormTextChange(event, 'denoiserName')}
                />
            </Form.Group>

            <Form.Group>
                <Form.Label>Description:</Form.Label>
                <Form.Control
                    type="text"
                    value={this.state.denoiserDescription}
                    onChange={(event) => this.handleFormTextChange(event, 'denoiserDescription')}
                />
            </Form.Group>

            <Form.Group>
                <Form.Label>Structure file:</Form.Label>
                <Form.Control
                    type="file"
                    onChange={(event) => this.handleFormFileContentChange(event, 'denoiserStructureFile', 'denoiserStructure', fileReader)}
                    name='denoiserStructureFile'
                />
            </Form.Group>

            <Button  variant="primary" type="submit">
                Create denoiser
            </Button>
        </Form>
    }
}

class DenoisersListView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {denoisers} = this.props;

        return<ListGroup>
            {denoisers.map(denoiser =>
                (<ListGroup.Item>
                    <DenoiserView denoiser={denoiser}/>
                </ListGroup.Item>))
            }
        </ListGroup>
    }
}

class DenoisersView extends Component{
    constructor(props){
        super(props);
    };

    componentDidMount() {
        console.log("DenoisersView successfully mounted.");
    }

    render() {
        const {denoisers} = this.props;

        return <Container fluid="lg">
            <Row>
                <Col>
                    <DenoisersListView
                        denoisers={denoisers}
                    />
                </Col>
                <Col>
                    <DenoiserForm/>
                </Col>
            </Row>
        </Container>
    }
}

export default DenoisersView;

const styles = {
    denoiserView: listElementStyle,
    denoisersList: listContainerStyle,
    denoiserPreview: {
        backgroundColor: theme.light,
        display: 'block',
        float: 'left',
        width: '100%',
    }
};