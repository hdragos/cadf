import React from 'react'

export function handleFormTextChange(event, stateName){
    let newState = {};
    newState[stateName] = event.target.value;
    this.setState(newState);
}

export function handleFormFileChange(event, stateName){
    let newState = {};
    newState[stateName] = event.target.files[0];
    this.setState(newState);
    event.preventDefault();
}

export function handleFormFileContentChange(event, fileStateName, contentStateName, fileReader){
    let newState = {};

    fileReader.onloadend = (function(contentStateName){
        return function (event) {
            const content = event.target.result;
            let newState = {};
            newState[contentStateName] = content;
            this.setState(newState);
        };
    })(contentStateName).bind(this);

    fileReader.readAsText(event.target.files[0]);

    newState[fileStateName] = event.target.files[0];
    this.setState(newState);
    event.preventDefault();
}

