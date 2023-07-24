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

You can choose from two installation options based on your preference:

### Option 1: Local Build

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

### Option 2: CDN Link

Alternatively, you can use the Langflow Widget directly from the CDN by including the following script tag in your HTML:

```html
<script src="https://cdn.example.com/langflow-widget.js"></script>
```

Make sure to replace `https://cdn.example.com/langflow-widget.js` with the actual URL of the CDN hosting the Langflow Widget.

Now, users can choose to either build the project locally or use the CDN link based on their needs. This provides them with flexibility and convenience when integrating the Langflow Widget into their applications. If you have any more updates or changes, feel free to let me know! I'm here to assist you further. Happy coding!

## Usage

```html
  <langflow-chat
    chat_input_field="the field in the flow that is used as chat input"
    chat_inputs='your input object'
    host_url="langflow url"
    flow_id="your_flow_id"
  ></langflow-chat>
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

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT) - see the [LICENSE](https://github.com/logspace-ai/langflow-embedded-chat/tree/main/LICENSE) file for details.
