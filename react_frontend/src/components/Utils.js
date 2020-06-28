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

export function downloadBinaryData(blob, extension, filename='sample') {
    // TO DO: Replace this method with a less hack-ish one
    // Idea by: https://medium.com/yellowcode/download-api-files-with-react-fetch-393e4dae0d9e
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', `${filename}.${extension}`);

    link.click();
    link.parentNode.removeChild(link);
}
