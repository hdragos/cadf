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

class DenoisersView extends Component{
    constructor(props){
        super(props);
        this.state = {
            denoisers: [],
        };
    };

    fetchData = () => {
        fetch(`${httpAddress}/denoisers`)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({denoisers: responseJson});
            })
            .catch((error) => {
                console.log("Error while fetching messages from the server. Reason: ", error)
            });
    };


    componentDidMount() {
        console.log("DenoisersView successfully mounted.");
        this.fetchData();
    }

    render() {
        const {denoisers} = this.state;

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