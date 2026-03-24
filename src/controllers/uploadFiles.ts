import axios from "axios";

export async function uploadFiles(
  baseUrl: string,
  flowId: string,
  files: File[],
  api_key?: string,
  additional_headers?: { [key: string]: string }
): Promise<string[]> {
  const paths: string[] = [];
  for (const file of files) {
    const formData = new FormData();
    formData.append("file", file);
    const headers: { [key: string]: string } = {};
    if (api_key) headers["x-api-key"] = api_key;
    if (additional_headers) {
      Object.keys(additional_headers).forEach((key) => {
        headers[key] = String(additional_headers[key]);
      });
    }
    const res = await axios.post(
      `${baseUrl}/api/v1/files/upload/${flowId}`,
      formData,
      { headers }
    );
    paths.push(res.data.file_path);
  }
  return paths;
}
