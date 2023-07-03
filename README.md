# `langflow-chat` Custom Component API

The `langflow-chat` custom component allows you to integrate a chat widget into your web application. This document provides an overview of the API for using this custom component.

## Usage
```html
<langflow-chat
    host_url="https://example.com"
    flow_id="your-flow-id"
></langflow-chat>
```

## API Reference

### Properties

The `langflow-chat` custom component accepts the following properties:
- `chat_position` (string?): The position of the chat window. Possible values are `top-left`, `top-center`, `top-right`, `center-left`, `center-right`, `bottom-left`, `bottom-center` and `bottom-right`. Default value is `top-left`.
- `host_url` (string): The URL of the host server for the chat widget.
- `flow_id` (string): The ID of the flow.
- `tweaks` (object?): JSON object containing additional tweaks for the flow.
- `chat_trigger_style` (object?): JSON object defining the style for chat trigger.
- `bot_message_style` (object?): JSON object defining the style for bot messages.
- `user_message_style` (object?): JSON object defining the style for user messages.
- `chat_window_style` (object?): JSON object defining the style for the chat window.
- `error_message_style` (object?): JSON object defining the style for error messages.
- `send_button_style` (object?): JSON object defining the style for the send button.
- `send_icon_style` (object?): JSON object defining the style for the send button icon.
- `input_style` (object?): JSON object defining the style for the input field.
- `input_container_style` (object?): JSON object defining the style for the input field container.
- `placeholder` (string): The placeholder text for the input field.

That's it! You can now integrate the `langflow-chat` custom component into your web application and customize it using the provided properties.
