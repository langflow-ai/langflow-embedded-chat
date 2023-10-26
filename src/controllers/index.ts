import axios from "axios";

export async function sendMessage(baseUrl: string, flowId: string, message: string,inputs: any,input_field:string,sessionId:React.MutableRefObject<string>, tweaks?: Object,api_key?:string) {
    let data:any;
    inputs[input_field] = message;
    if (tweaks) {
        data = { inputs: inputs, tweaks: tweaks };
    }
    else {
        data = { inputs: inputs };
    }
    const headers:{[key:string]:string}= {"Content-Type": "application/json"}
    if( api_key){
        headers["x-api-key"]=api_key;
    }
    if(sessionId.current && sessionId.current!=""){
        data.session_id=sessionId.current;
    }
    let response = axios.post(`${baseUrl}/api/v1/process/${flowId}`, data,{headers});
    return response;
}