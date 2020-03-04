import React, {Component} from 'react'
import {theme, httpAddress, listElementStyle, listContainerStyle} from "./Constants";

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

class LayersList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            layers: []
        }
    }

    render() {


        return <div>
            <ul>

            </ul>
            <button>
                Add new layer
            </button>
        </div>
    }
}

class LayerProperties extends Component {
    render() {
        return <p>Layer props</p>
    }
}

class LayerForm extends Component {
    render() {
        return <p>Layer</p>
    }
}


class DenoisersForm extends Component {
    constructor(props){
        super(props);
        this.state = {
          denoiserName: null,
          denoiserDescription: null,
          denoiserTrainable: true,
          denoiserStructure: {
              type: null,
              input_shape: null,
              optimizer: null,
              loss_function: null,
          }
        };
    }

    handleSubmit = (event) => {
        alert("Form submission!");
        event.preventDefault();
    };

    render() {

        return <form onSubmit={(event) => this.handleSubmit(event)}>
            <h1>Upload a new denoiser:</h1>
            <label>Name:</label>
            <input
                type="text"
                value={this.state.denoiserName}
            />
            <LayersList/>
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
            <div>
                <p>Dataset preview placeholder</p>
            </div>
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