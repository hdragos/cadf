import React from 'react'

const serverAddress = "127.0.0.1:5000";
const httpAddress = "http://" + serverAddress;
const wsAddress = "ws://"+serverAddress;

const theme = {
    light: '#66ccff',
    dark: '#1ab2ff',
    defaultFont: 'Lucida Console',
};

const listContainerStyle = {
    backgroundColor: theme.light,
    display: 'block',
    float: 'left',
    width: '100%',
    listStyleType: 'none',
};

const listElementStyle = {
    fontSize: '10pt',
    fontFamily: 'Lucida Console',
    backgroundColor: theme.dark,
    borderRadius: '15px',
    padding: '5px',
    margin: '5px',
    width: '95%',
};

export {theme, serverAddress, httpAddress, wsAddress, listContainerStyle, listElementStyle}