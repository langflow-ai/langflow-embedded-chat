import axios from "axios";

export async function sendMessage(baseUrl: string, flowId: string, message: string, tweaks?: Object) {
    let data;
    if (tweaks) {
        data = { inputs: {text: message}, tweaks: tweaks };
    }
    else {
        data = { inputs: {text: message} };
    }
    let response = axios.post(`${baseUrl}/api/v1/process/${flowId}`, data,{headers:{"Content-Type": "application/json"}});
    return response;
}