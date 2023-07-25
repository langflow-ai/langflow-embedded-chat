# Langflow Embedded Chat ⛓️

Welcome to the Langflow Embedded Chat repository! 🎉

The Langflow Embedded Chat is a powerful web component that enables seamless communication with the [Langflow ⛓️](https://github.com/logspace-ai/langflow). This widget provides a chat interface, allowing you to integrate Langflow ⛓️ into your web applications effortlessly.

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## What is Langflow?

Langflow is a no-code open-source project that empowers developers to build cutting-edge applications using Language Model technologies. With Langflow, you can leverage the power of LLMs (Large Language Models) to enhance user interactions, generate human-like text, and gain valuable insights from natural language data.

## Features

🌟 Seamless Integration: Easily integrate the Langflow Widget into your website or web application with just a few lines of JavaScript.

🚀 Interactive Chat Interface: Engage your users with a user-friendly chat interface, powered by Langflow's advanced language understanding capabilities.

🎛️ Customizable Styling: Customize the appearance of the chat widget to match your application's design and branding.

🌐 Multilingual Support: Communicate with users in multiple languages, opening up your application to a global audience.

## Installation

### Option 1: CDN Link

Use the Langflow Widget directly from the CDN by including the following script tag in your HTML:

```html
<script src="https://cdn.example.com/langflow-widget.js"></script>
```

### Option 2: Local Build

1. Clone this repository to your local machine:

```bash
git clone https://github.com/logspace-ai/langflow-embedded-chat.git
```

2. Navigate to the project directory:

```bash
cd langflow-embedded-chat
```

3. Build the project to generate the bundle:

```bash
npm run build
```

5. After the build process completes, you'll find the bundle in the `dist/build/static/js` folder. You can include this JavaScript file in your HTML:

```html
<script src="path/to/your/langflow-widget.js"></script>
```

## Usage

```html
<html lang="en">
<head>
<script src="path/to/your/langflow-widget.js"></script>
</head>
<body style="width: 100vh; height: 100vh; ">
<langflow-chat
    chat_input_field="the field in the flow that is used as chat input"
    chat_inputs='your input object'
    host_url="langflow url"
    flow_id="your_flow_id"
  ></langflow-chat>
</body>
</html>
```

## Configuration

Use the widget API to customize your widget:

| Prop                  | Type      | Required |
|-----------------------|-----------|----------|
| bot_message_style     | json      | No       |
| chat_input_field      | string    | Yes      |
| chat_inputs           | json      | Yes      |
| chat_position         | string    | No       |
| chat_trigger_style    | json      | No       |
| chat_window_style     | json      | No       |
| chat_output_key       | string    | No       |
| error_message_style   | json      | No       |
| flow_id               | string    | Yes      |
| height                | number    | No       |
| host_url              | string    | Yes      |
| input_container_style | json      | No       |
| input_style           | json      | No       |
| online                | boolean   | No       |
| online_message        | string    | No       |
| placeholder           | string    | No       |
| placeholder_sending   | string    | No       |
| send_button_style     | json      | No       |
| send_icon_style       | json      | No       |
| tweaks                | json      | No       |
| user_message_style    | json      | No       |
| width                 | number    | No       |
| window_title          | string    | No       |

- **bot_message_style:**
  - Type: JSON
  - Required: No
  - Description: Styling options for formatting bot messages in the chat window.

- **chat_input_field:**
  - Type: String
  - Required: Yes
  - Description: Specifies the input field type for chat messages.

- **chat_inputs:**
  - Type: JSON
  - Required: Yes
  - Description: Defines the chat input elements and their values.
 
- **chat_output_key:**
  - Type: String
  - Required: No
  - Description: Specify which output to choose if there is more than one output.

- **chat_position:**
  - Type: String
  - Required: No
  - Description: Determines the position of the chat window (top-left, top-center, top-right, center-left, center-right, bottom-right, bottom-center, bottom-left).

- **chat_trigger_style:**
  - Type: JSON
  - Required: No
  - Description: Styling options for the chat trigger.

- **chat_window_style:**
  - Type: JSON
  - Required: No
  - Description: Styling options for the overall chat window.

- **error_message_style:**
  - Type: JSON
  - Required: No
  - Description: Styling options for error messages in the chat window.

- **flow_id:**
  - Type: String
  - Required: Yes
  - Description: Identifier for the flow associated with the component.

- **height:**
  - Type: Number
  - Required: No
  - Description: Specifies the height of the chat window in pixels.

- **host_url:**
  - Type: String
  - Required: Yes
  - Description: The URL of the host for communication with the chat component.

- **input_container_style:**
  - Type: JSON
  - Required: No
  - Description: Styling options for the input container where chat messages are typed.

- **input_style:**
  - Type: JSON
  - Required: No
  - Description: Styling options for the chat input field.

- **Online:**
  - Type: Boolean
  - Required: No
  - Description: Indicates if the chat component is online or offline.

- **online_message:**
  - Type: String
  - Required: No
  - Description: Custom message to display when the chat component is online.

- **placeholder:**
  - Type: String
  - Required: No
  - Description: Placeholder text for the chat input field.

- **placeholder_sending:**
  - Type: String
  - Required: No
  - Description: Placeholder text to display while a message is being sent.

- **send_button_style:**
  - Type: JSON
  - Required: No
  - Description: Styling options for the send button in the chat window.

- **send_icon_style:**
  - Type: JSON
  - Required: No
  - Description: Styling options for the send icon in the chat window.

- **tweaks:**
  - Type: JSON
  - Required: No
  - Description: Additional custom tweaks for the associated flow.

- **user_message_style:**
  - Type: JSON
  - Required: No
  - Description: Styling options for formatting user messages in the chat window.

- **width:**
  - Type: Number
  - Required: No
  - Description: Specifies the width of the chat window in pixels.

- **window_title:**
  - Type: String
  - Required: No
  - Description: Title for the chat window, displayed in the header or title bar.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT) - see the [LICENSE](https://github.com/logspace-ai/langflow-embedded-chat/tree/main/LICENSE) file for details.
