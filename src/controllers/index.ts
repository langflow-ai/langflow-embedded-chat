import axios from "axios";

export async function sendMessage(baseUrl: string, flowId: string, message: string,input_type:string,output_type:string,sessionId:React.MutableRefObject<string>,output_component?:string, tweaks?: Object,api_key?:string,additional_headers?:{[key:string]:string} | string) {
    let data:any;
    data = {input_type,input_value:message,output_type}
    if (tweaks) {
        data["tweaks"]= tweaks
    }
    if(output_component){
        data["output_component"]=output_component;
    }
    let headers:{[key:string]:string}= {"Content-Type": "application/json"}
    if( api_key){
        headers["x-api-key"]=api_key;
    }
    if (additional_headers){
        // Parse additional_headers if it's a string (can happen when passed as HTML attribute)
        let parsedHeaders: {[key:string]:string} = {};
        if (typeof additional_headers === 'string') {
            try {
                parsedHeaders = JSON.parse(additional_headers);
            } catch (e) {
                console.error('Failed to parse additional_headers as JSON:', e, 'Value:', additional_headers);
                // Continue without additional headers if parsing fails
                parsedHeaders = {};
            }
        } else {
            parsedHeaders = additional_headers;
        }
        // Merge headers, ensuring all values are strings
        Object.keys(parsedHeaders).forEach(key => {
            headers[key] = String(parsedHeaders[key]);
        });
    }
    if(sessionId.current && sessionId.current!=""){
        data.session_id=sessionId.current;
    }
    let response = axios.post(`${baseUrl}/api/v1/run/${flowId}`, data,{headers});
    return response;
}