import React, {Component} from "react";
import ToolbarMenu from "./ToolbarMenu";
import {httpAddress} from "./Constants";

class AppStore extends Component {
    constructor(props){
        super(props);
        this.state = {
            denoisers: [],
            datasets: [],
            training_sessions: [],
        }
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData(resourceName) {
        fetch(`${httpAddress}/${resourceName}`)
            .then((response) => response.json())
            .then((responseJson) => {
                let newData = {};
                newData[resourceName] = responseJson;
                this.setState(newData);
            })
            .catch((error) => {
                console.log("Error while fetching messages from the server. Reason: ", error)
            });
    }

    render() {
        console.log(this.state);
        return <ToolbarMenu
            fetchData = {this.fetchData}
        />
    }
}

export default AppStore;