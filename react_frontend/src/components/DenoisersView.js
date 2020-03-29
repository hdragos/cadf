import React, {Component} from 'react'
import {theme, httpAddress, listElementStyle, listContainerStyle} from "./Constants";
import {handleFormFileChange, handleFormTextChange, handleFormFileContentChange} from "./Utils";

class DenoiserView extends Component{
    constructor(props){
        super(props);
    }

    render() {
        const {denoiser} = this.props;

        return <div style={styles.denoiserView}>
            <p>Denoiser ID: {denoiser.id}</p>
            <p>Denoiser name: {denoiser.name}</p>
            <p>Denoiser description: {denoiser.description}</p>
        </div>
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

        return <form onSubmit={(event) => this.handleSubmit(event)}
            style={styles.denoiserPreview}
            encType="multipart/form-data"
            >
            <h1>Upload a new denoiser:</h1>
            <label>Name:</label>
            <input
                type="text"
                value={this.state.denoiserName}
                onChange={(event) => this.handleFormTextChange(event, 'denoiserName')}
            />
            <label>Description:</label>
            <input
                type="text"
                value={this.state.denoiserDescription}
                onChange={(event) => this.handleFormTextChange(event, 'denoiserDescription')}
            />
            <label>Structure file:</label>
            <input
                type="file"
                onChange={(event) => this.handleFormFileContentChange(event, 'denoiserStructureFile', 'denoiserStructure', fileReader)}
                name='denoiserStructureFile'
            />
            <input type="submit" value="Submit"/>
        </form>
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

        return <div>
            <ul style={styles.denoisersList}>
                {denoisers.map(denoiser => (
                    <DenoiserView
                        denoiser={denoiser}
                    />
                ))}
            </ul>
            <DenoiserForm/>
        </div>
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