import React from 'react';
import ReactDOM from 'react-dom/client';
import r2wc from '@r2wc/react-to-web-component';
import ChatWidget from './chatWidget';
import "./index.css"

customElements.define('langflow-chat', r2wc(ChatWidget, {
    props: {
        chat_trigger_style: "json",
        host_url: "string",
        flow_id: "string",
        tweaks:"json",
        bot_message_style:"json",
        user_message_style:"json",
        chat_window_style:"json",
        error_message_style:"json",
        send_button_style:"json",
        send_icon_style:"json",
        placeholder:"string",
        input_style:"json",
        input_container_style:"json",
        chat_position:"string",
    },
}));