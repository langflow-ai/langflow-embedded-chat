# `langflow-chat` Custom Component API

The `langflow-chat` custom component allows you to integrate a chat widget into your web application. This document provides an overview of the API for using this custom component.

## Usage

To use the `langflow-chat` custom component, you need to define it using the `customElements.define()` method. Here's an example of how to do it:

```javascript
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
    },
}));
```

## API Reference

### Properties

The `langflow-chat` custom component accepts the following properties:

- `chat_trigger_style` (string): Specifies the style for the chat trigger element.
- `host_url` (string): The URL of the host server for the chat widget.
- `flow_id` (string): The ID of the chat flow.
- `tweaks` (object): JSON object containing additional tweaks or configurations for the chat widget.
- `bot_message_style` (object): JSON object defining the style for bot messages.
- `user_message_style` (object): JSON object defining the style for user messages.
- `chat_window_style` (object): JSON object defining the style for the chat window.
- `error_message_style` (object): JSON object defining the style for error messages.
- `send_button_style` (object): JSON object defining the style for the send button.
- `send_icon_style` (object): JSON object defining the style for the send button icon.
- `placeholder` (string): The placeholder text for the input field.
- `input_style` (object): JSON object defining the style for the input field.
- `input_container_style` (object): JSON object defining the style for the input field container.

Please note that the `json` type mentioned above indicates that the corresponding property expects a JSON object.

## Example

Here's an example of how you can use the `langflow-chat` custom component in your HTML:

```html
<langflow-chat
    chat_trigger_style="your-style"
    host_url="https://example.com"
    flow_id="your-flow-id"
    tweaks="your-tweaks"
    bot_message_style="your-bot-style"
    user_message_style="your-user-style"
    chat_window_style="your-window-style"
    error_message_style="your-error-style"
    send_button_style="your-button-style"
    send_icon_style="your-icon-style"
    placeholder="Your placeholder text"
    input_style="your-input-style"
    input_container_style="your-container-style"
></langflow-chat>
```

Make sure to replace the placeholder values with your own styles, URLs, and IDs.

That's it! You can now integrate the `langflow-chat` custom component into your web application and customize it using the provided properties.