import { useRef, useState } from "react";
import ChatTrigger from "./chatTrigger";
import ChatWindow from "./chatWindow";
import { ChatMessageType } from "../types/chatWidget";

export default function ChatWidget({
  api_key,
  chat_input_field,
  chat_inputs,
  chat_trigger_style,
  host_url,
  flow_id,
  tweaks,
  send_icon_style,
  bot_message_style,
  user_message_style,
  chat_window_style,
  height,
  width,
  error_message_style,
  send_button_style,
  online,
  online_message,
  offline_message,
  chat_output_key,
  window_title,
  chat_position,
  placeholder,
  input_style,
  placeholder_sending,
  input_container_style,
  additional_headers,
}: {
  api_key?: string;
  chat_inputs: Object;
  chat_input_field: string;
  send_icon_style?: React.CSSProperties;
  chat_position?: string;
  chat_trigger_style?: React.CSSProperties;
  bot_message_style?: React.CSSProperties;
  user_message_style?: React.CSSProperties;
  chat_window_style?: React.CSSProperties;
  online?: boolean;
  online_message?: string;
  offline_message?: string;
  chat_output_key?: string;
  height?: number;
  width?: number;
  window_title?: string;
  error_message_style?: React.CSSProperties;
  send_button_style?: React.CSSProperties;
  placeholder_sending?: string;
  placeholder?: string;
  input_style?: React.CSSProperties;
  input_container_style?: React.CSSProperties;
  host_url: string;
  flow_id: string;
  tweaks?: { [key: string]: any };
  additional_headers?: {[key:string]:string};
}) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const sessionId = useRef("");
  function updateLastMessage(message: ChatMessageType) {
    setMessages((prev) => {
      prev[prev.length - 1] = message;
      return [...prev];
    });
  }
  function addMessage(message: ChatMessageType) {
    setMessages((prev) => [...prev, message]);
  }
  const triggerRef = useRef<HTMLButtonElement>(null);

  const styles = `
    /*
! tailwindcss v3.3.2 | MIT License | https://tailwindcss.com
*/

/*
1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)
2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)
*/

*,
::before,
::after {
  box-sizing: border-box;
  /* 1 */
  border-width: 0;
  /* 2 */
  border-style: solid;
  /* 2 */
  border-color: #e5e7eb;
  /* 2 */
}

::before,
::after {
  --tw-content: '';
}

/*
1. Use a consistent sensible line-height in all browsers.
2. Prevent adjustments of font size after orientation changes in iOS.
3. Use a more readable tab size.
4. Use the user's configured 'sans' font-family by default.
5. Use the user's configured 'sans' font-feature-settings by default.
6. Use the user's configured 'sans' font-variation-settings by default.
*/

html {
  line-height: 1.5;
  /* 1 */
  -webkit-text-size-adjust: 100%;
  /* 2 */
  /* 3 */
  tab-size: 4;
  /* 3 */
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  /* 4 */
  -webkit-font-feature-settings: normal;
          font-feature-settings: normal;
  /* 5 */
  font-variation-settings: normal;
  /* 6 */
}

/*
1. Remove the margin in all browsers.
2. Inherit line-height from 'html' so users can set them as a class directly on the 'html' element.
*/

body {
  margin: 0;
  /* 1 */
  line-height: inherit;
  /* 2 */
}

/*
1. Add the correct height in Firefox.
2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)
3. Ensure horizontal rules are visible by default.
*/

hr {
  height: 0;
  /* 1 */
  color: inherit;
  /* 2 */
  border-top-width: 1px;
  /* 3 */
}

/*
Add the correct text decoration in Chrome, Edge, and Safari.
*/

abbr:where([title]) {
  -webkit-text-decoration: underline dotted;
          text-decoration: underline dotted;
}

/*
Remove the default font size and weight for headings.
*/

h1,
h2,
h3,
h4,
h5,
h6 {
  font-size: inherit;
  font-weight: inherit;
}

/*
Reset links to optimize for opt-in styling instead of opt-out.
*/

a {
  color: inherit;
  text-decoration: inherit;
}

/*
Add the correct font weight in Edge and Safari.
*/

b,
strong {
  font-weight: bolder;
}

/*
1. Use the user's configured 'mono' font family by default.
2. Correct the odd 'em' font sizing in all browsers.
*/

code,
kbd,
samp,
pre {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  /* 1 */
  font-size: 1em;
  /* 2 */
}

/*
Add the correct font size in all browsers.
*/

small {
  font-size: 80%;
}

/*
Prevent 'sub' and 'sup' elements from affecting the line height in all browsers.
*/

sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

sub {
  bottom: -0.25em;
}

sup {
  top: -0.5em;
}

/*
1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)
2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)
3. Remove gaps between table borders by default.
*/

table {
  text-indent: 0;
  /* 1 */
  border-color: inherit;
  /* 2 */
  border-collapse: collapse;
  /* 3 */
}

/*
1. Change the font styles in all browsers.
2. Remove the margin in Firefox and Safari.
3. Remove default padding in all browsers.
*/

button,
input,
optgroup,
select,
textarea {
  font-family: inherit;
  /* 1 */
  font-size: 100%;
  /* 1 */
  font-weight: inherit;
  /* 1 */
  line-height: inherit;
  /* 1 */
  color: inherit;
  /* 1 */
  margin: 0;
  /* 2 */
  padding: 0;
  /* 3 */
}

/*
Remove the inheritance of text transform in Edge and Firefox.
*/

button,
select {
  text-transform: none;
}

/*
1. Correct the inability to style clickable types in iOS and Safari.
2. Remove default button styles.
*/

button,
[type='button'],
[type='reset'],
[type='submit'] {
  -webkit-appearance: button;
  /* 1 */
  background-color: transparent;
  /* 2 */
  background-image: none;
  /* 2 */
}

/*
Use the modern Firefox focus style for all focusable elements.
*/

:-moz-focusring {
  outline: auto;
}

/*
Remove the additional ':invalid' styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)
*/

:-moz-ui-invalid {
  box-shadow: none;
}

/*
Add the correct vertical alignment in Chrome and Firefox.
*/

progress {
  vertical-align: baseline;
}

/*
Correct the cursor style of increment and decrement buttons in Safari.
*/

::-webkit-inner-spin-button,
::-webkit-outer-spin-button {
  height: auto;
}

/*
1. Correct the odd appearance in Chrome and Safari.
2. Correct the outline style in Safari.
*/

[type='search'] {
  -webkit-appearance: textfield;
  /* 1 */
  outline-offset: -2px;
  /* 2 */
}

/*
Remove the inner padding in Chrome and Safari on macOS.
*/

::-webkit-search-decoration {
  -webkit-appearance: none;
}

/*
1. Correct the inability to style clickable types in iOS and Safari.
2. Change font properties to 'inherit' in Safari.
*/

::-webkit-file-upload-button {
  -webkit-appearance: button;
  /* 1 */
  font: inherit;
  /* 2 */
}

/*
Add the correct display in Chrome and Safari.
*/

summary {
  display: list-item;
}

/*
Removes the default spacing and border for appropriate elements.
*/

blockquote,
dl,
dd,
h1,
h2,
h3,
h4,
h5,
h6,
hr,
figure,
p,
pre {
  margin: 0;
}

fieldset {
  margin: 0;
  padding: 0;
}

legend {
  padding: 0;
}

ol,
ul,
menu {
  list-style: none;
  margin: 0;
  padding: 0;
}

/*
Prevent resizing textareas horizontally by default.
*/

textarea {
  resize: vertical;
}

/*
1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)
2. Set the default placeholder color to the user's configured gray 400 color.
*/

input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
  opacity: 1;
  /* 1 */
  color: #9ca3af;
  /* 2 */
}

input::placeholder,
textarea::placeholder {
  opacity: 1;
  /* 1 */
  color: #9ca3af;
  /* 2 */
}

/*
Set the default cursor for buttons.
*/

button,
[role="button"] {
  cursor: pointer;
}

/*
Make sure disabled buttons don't get the pointer cursor.
*/

:disabled {
  cursor: default;
}

/*
1. Make replaced elements 'display: block' by default. (https://github.com/mozdevs/cssremedy/issues/14)
2. Add 'vertical-align: middle' to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)
   This can trigger a poorly considered lint error in some tools but is included by design.
*/

img,
svg,
video,
canvas,
audio,
iframe,
embed,
object {
  display: block;
  /* 1 */
  vertical-align: middle;
  /* 2 */
}

/*
Constrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)
*/

img,
video {
  max-width: 100%;
  height: auto;
}

/* Make elements with the HTML hidden attribute stay hidden by default */

[hidden] {
  display: none;
}

*, ::before, ::after {
  --tw-border-spacing-x: 0;
  --tw-border-spacing-y: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-pan-x:  ;
  --tw-pan-y:  ;
  --tw-pinch-zoom:  ;
  --tw-scroll-snap-strictness: proximity;
  --tw-gradient-from-position:  ;
  --tw-gradient-via-position:  ;
  --tw-gradient-to-position:  ;
  --tw-ordinal:  ;
  --tw-slashed-zero:  ;
  --tw-numeric-figure:  ;
  --tw-numeric-spacing:  ;
  --tw-numeric-fraction:  ;
  --tw-ring-inset:  ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgb(59 130 246 / 0.5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  --tw-blur:  ;
  --tw-brightness:  ;
  --tw-contrast:  ;
  --tw-grayscale:  ;
  --tw-hue-rotate:  ;
  --tw-invert:  ;
  --tw-saturate:  ;
  --tw-sepia:  ;
  --tw-drop-shadow:  ;
  --tw-backdrop-blur:  ;
  --tw-backdrop-brightness:  ;
  --tw-backdrop-contrast:  ;
  --tw-backdrop-grayscale:  ;
  --tw-backdrop-hue-rotate:  ;
  --tw-backdrop-invert:  ;
  --tw-backdrop-opacity:  ;
  --tw-backdrop-saturate:  ;
  --tw-backdrop-sepia:  ;
}

::-webkit-backdrop {
  --tw-border-spacing-x: 0;
  --tw-border-spacing-y: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-pan-x:  ;
  --tw-pan-y:  ;
  --tw-pinch-zoom:  ;
  --tw-scroll-snap-strictness: proximity;
  --tw-gradient-from-position:  ;
  --tw-gradient-via-position:  ;
  --tw-gradient-to-position:  ;
  --tw-ordinal:  ;
  --tw-slashed-zero:  ;
  --tw-numeric-figure:  ;
  --tw-numeric-spacing:  ;
  --tw-numeric-fraction:  ;
  --tw-ring-inset:  ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgb(59 130 246 / 0.5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  --tw-blur:  ;
  --tw-brightness:  ;
  --tw-contrast:  ;
  --tw-grayscale:  ;
  --tw-hue-rotate:  ;
  --tw-invert:  ;
  --tw-saturate:  ;
  --tw-sepia:  ;
  --tw-drop-shadow:  ;
  --tw-backdrop-blur:  ;
  --tw-backdrop-brightness:  ;
  --tw-backdrop-contrast:  ;
  --tw-backdrop-grayscale:  ;
  --tw-backdrop-hue-rotate:  ;
  --tw-backdrop-invert:  ;
  --tw-backdrop-opacity:  ;
  --tw-backdrop-saturate:  ;
  --tw-backdrop-sepia:  ;
}

::backdrop {
  --tw-border-spacing-x: 0;
  --tw-border-spacing-y: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-pan-x:  ;
  --tw-pan-y:  ;
  --tw-pinch-zoom:  ;
  --tw-scroll-snap-strictness: proximity;
  --tw-gradient-from-position:  ;
  --tw-gradient-via-position:  ;
  --tw-gradient-to-position:  ;
  --tw-ordinal:  ;
  --tw-slashed-zero:  ;
  --tw-numeric-figure:  ;
  --tw-numeric-spacing:  ;
  --tw-numeric-fraction:  ;
  --tw-ring-inset:  ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgb(59 130 246 / 0.5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  --tw-blur:  ;
  --tw-brightness:  ;
  --tw-contrast:  ;
  --tw-grayscale:  ;
  --tw-hue-rotate:  ;
  --tw-invert:  ;
  --tw-saturate:  ;
  --tw-sepia:  ;
  --tw-drop-shadow:  ;
  --tw-backdrop-blur:  ;
  --tw-backdrop-brightness:  ;
  --tw-backdrop-contrast:  ;
  --tw-backdrop-grayscale:  ;
  --tw-backdrop-hue-rotate:  ;
  --tw-backdrop-invert:  ;
  --tw-backdrop-opacity:  ;
  --tw-backdrop-saturate:  ;
  --tw-backdrop-sepia:  ;
}

.cl-trigger {
  display: flex;
  height: 3rem;
  width: 3rem;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  --tw-bg-opacity: 1;
  background-color: rgb(59 130 246 / var(--tw-bg-opacity));
  font-weight: 700;
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity));
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.cl-trigger:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(29 78 216 / var(--tw-bg-opacity));
}

.cl-window {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 1rem;
  --tw-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  --tw-shadow-colored: 0 0 10px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.cl-scale-100 {
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  -webkit-transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
          transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.cl-scale-0 {
  --tw-scale-x: 0;
  --tw-scale-y: 0;
  -webkit-transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
          transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.cl-trigger-icon {
  position: absolute;
  height: 50%;
  width: 50%;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 500ms;
}

.cl-chat-window {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
  "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
  sans-serif;
  position: absolute;
  transition-property: all;
  transition-duration: 300ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.cl-online-message {
  height: 0.5rem;
  width: 0.5rem;
  border-radius: 9999px;
  --tw-bg-opacity: 1;
  background-color: rgb(34 197 94 / var(--tw-bg-opacity));
}

.cl-offline-message {
  height: 0.5rem;
  width: 0.5rem;
  border-radius: 9999px;
  --tw-bg-opacity: 1;
  background-color: rgb(239 68 68 / var(--tw-bg-opacity));
}

.cl-send-icon {
  margin-right: 1.25rem;
  height: 1.5rem;
  width: 1.5rem;
}

.cl-notsending-message {
  stroke: #3b82f6;
}

.cl-notsending-message:hover {
  stroke: #60a5fa;
}

.cl-sending-message {
  stroke: #9ca3af;
}

.cl-header-subtitle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 300;
  color: rgb(107 114 128);
}

.cl-header {
  z-index: 10;
  display: flex;
  flex-direction: column;
  --tw-bg-opacity: 1;
  background-color: rgb(255 255 255 / var(--tw-bg-opacity));
  padding-top: 1rem;
  padding-bottom: 1rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  font-size: 1.125rem;
  line-height: 1.75rem;
  font-weight: 400;
  color: rgb(17 24 39);
  --tw-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  --tw-shadow-colored: 0 0 10px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.cl-messages_container {
  z-index: 0;
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  overflow: scroll;
  overflow-x: clip;
  --tw-bg-opacity: 1;
  background-color: rgb(249 250 251 / var(--tw-bg-opacity));
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.cl-messages_container::-webkit-scrollbar {
  display: none;
}

.cl-input_container {
  display: flex;
  width: 100%;
  align-items: center;
  border-top-width: 1px;
  --tw-border-opacity: 1;
  border-color: rgb(229 231 235 / var(--tw-border-opacity));
  --tw-bg-opacity: 1;
  background-color: rgb(255 255 255 / var(--tw-bg-opacity));
}

.cl-chat-message {
  display: flex;
  width: 100%;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

@-webkit-keyframes pulse {
  50% {
    opacity: .5;
  }
}

@keyframes pulse {
  50% {
    opacity: .5;
  }
}

.cl-animate-pulse {
  -webkit-animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.cl-justify-start {
  justify-content: flex-start;
}

.cl-justify-end {
  justify-content: flex-end;
}

.cl-input-element {
  height: 100%;
  width: 100%;
  padding-left: 1.25rem;
  padding-right: 1.25rem;
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
  font-weight: 300;
  background-color: rgb(255 255 255);
  color: rgb(17 24 39);
}

.cl-input-element:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.cl-user_message {
  width: -webkit-fit-content;
  width: -moz-fit-content;
  width: fit-content;
  max-width: 90%;
  -webkit-column-break-before: all;
          break-before: all;
  border-radius: 0.75rem;
  border-top-right-radius: 0.125rem;
  --tw-bg-opacity: 1;
  background-color: rgb(59 130 246 / var(--tw-bg-opacity));
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  text-align: right;
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity));
}

.cl-error_message {
  width: -webkit-fit-content;
  width: -moz-fit-content;
  width: fit-content;
  max-width: 90%;
  -webkit-column-break-before: all;
          break-before: all;
  border-radius: 0.75rem;
  border-top-left-radius: 0.125rem;
  --tw-bg-opacity: 1;
  background-color: rgb(248 113 113 / var(--tw-bg-opacity));
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  text-align: left;
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity));
}

.cl-bot_message {
  width: -webkit-fit-content;
  width: -moz-fit-content;
  width: fit-content;
  max-width: 90%;
  -webkit-column-break-before: all;
          break-before: all;
  border-radius: 0.75rem;
  border-top-left-radius: 0.125rem;
  --tw-bg-opacity: 1;
  background-color: rgb(229 231 235 / var(--tw-bg-opacity));
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  text-align: left;
  --tw-text-opacity: 1;
  color: rgb(31 41 55 / var(--tw-text-opacity));
}

.origin-bottom {
  -webkit-transform-origin: bottom;
          transform-origin: bottom;
}

.origin-bottom-left {
  -webkit-transform-origin: bottom left;
          transform-origin: bottom left;
}

.origin-bottom-right {
  -webkit-transform-origin: bottom right;
          transform-origin: bottom right;
}

.origin-center {
  -webkit-transform-origin: center;
          transform-origin: center;
}

.origin-top {
  -webkit-transform-origin: top;
          transform-origin: top;
}

.origin-top-left {
  -webkit-transform-origin: top left;
          transform-origin: top left;
}

.origin-top-right {
  -webkit-transform-origin: top right;
          transform-origin: top right;
}

.shadow {
  --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
} 
input::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: rgb(156 163 175);
  opacity: 1; /* Firefox */
}

input:-ms-input-placeholder { /* Internet Explorer 10-11 */
  color: rgb(156 163 175);
}

input::-ms-input-placeholder { /* Microsoft Edge */
  color: rgb(156 163 175);
}
    `;
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }}></style>
      <ChatTrigger
        triggerRef={triggerRef}
        open={open}
        setOpen={setOpen}
        style={chat_trigger_style}
      />
      <ChatWindow
        api_key={api_key}
        chat_input_field={chat_input_field}
        chat_inputs={chat_inputs}
        open={open}
        height={height}
        width={width}
        send_icon_style={send_icon_style}
        bot_message_style={bot_message_style}
        user_message_style={user_message_style}
        chat_window_style={chat_window_style}
        error_message_style={error_message_style}
        send_button_style={send_button_style}
        placeholder={placeholder}
        input_style={input_style}
        online={online}
        online_message={online_message}
        offline_message={offline_message}
        chat_output_key={chat_output_key}
        placeholder_sending={placeholder_sending}
        window_title={window_title}
        input_container_style={input_container_style}
        tweaks={tweaks}
        flowId={flow_id}
        hostUrl={host_url}
        updateLastMessage={updateLastMessage}
        addMessage={addMessage}
        messages={messages}
        triggerRef={triggerRef}
        position={chat_position}
        sessionId={sessionId}
        additional_headers={additional_headers}
      />
    </>
  );
}
