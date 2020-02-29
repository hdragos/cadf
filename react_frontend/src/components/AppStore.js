import React, {Component} from "react";
import ToolbarMenu from "./ToolbarMenu";

class AppStore extends Component {
    constructor(props){
        super(props);
    }

    render() {
        return <ToolbarMenu/>
    }
}

export default AppStore;