import React from 'react';
import ReactDOM from 'react-dom/client';
import r2wc from '@r2wc/react-to-web-component';
import ChatWidget from './chatWidget';
import "./index.css"

customElements.define('react-app', r2wc(ChatWidget, {
    props: {
        trigger: "json"
    },
}));