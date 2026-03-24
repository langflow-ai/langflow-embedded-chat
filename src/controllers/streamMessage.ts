export interface StreamCallbacks {
  onToken: (chunk: string) => void;
  onEnd: (data: any) => void;
  onError: (error: string) => void;
}

export async function sendMessageStreaming(
  baseUrl: string,
  flowId: string,
  message: string,
  input_type: string,
  output_type: string,
  sessionId: string,
  callbacks: StreamCallbacks,
  output_component?: string,
  tweaks?: Object,
  api_key?: string,
  additional_headers?: { [key: string]: string },
  signal?: AbortSignal,
): Promise<void> {
  const data: any = { input_type, input_value: message, output_type };
  if (tweaks) data.tweaks = tweaks;
  if (output_component) data.output_component = output_component;
  if (sessionId) data.session_id = sessionId;

  const headers: { [key: string]: string } = { "Content-Type": "application/json" };
  if (api_key) headers["x-api-key"] = api_key;
  if (additional_headers) {
    Object.keys(additional_headers).forEach((key) => {
      headers[key] = String(additional_headers[key]);
    });
  }

  let endOrErrorCalled = false;

  try {
    const response = await fetch(
      `${baseUrl}/api/v1/run/${flowId}?stream=true`,
      { method: "POST", headers, body: JSON.stringify(data), signal }
    );

    if (!response.ok) {
      const errorText = await response.text();
      endOrErrorCalled = true;
      callbacks.onError(errorText || `HTTP ${response.status}`);
      return;
    }

    if (!response.body) {
      endOrErrorCalled = true;
      callbacks.onEnd(null);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer: string[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const parts = chunk.split("\n\n");

      for (const part of parts) {
        if (!part.trim()) continue;

        const accumulated = buffer.join("") + part;
        if (accumulated.endsWith("}")) {
          try {
            const parsed = JSON.parse(accumulated);
            buffer = [];

            if (parsed.chunk !== undefined) {
              callbacks.onToken(parsed.chunk);
            } else if (parsed.result !== undefined) {
              endOrErrorCalled = true;
              callbacks.onEnd(parsed.result);
            } else if (parsed.error !== undefined) {
              endOrErrorCalled = true;
              callbacks.onError(typeof parsed.error === "string" ? parsed.error : JSON.stringify(parsed.error));
            }
          } catch {
            buffer.push(part);
          }
        } else {
          buffer.push(part);
        }
      }
    }
  } catch (err: any) {
    if (err.name === "AbortError") {
      return;
    }
    endOrErrorCalled = true;
    callbacks.onError(err.message || "Stream connection failed");
    return;
  }

  // Stream completion safety: ensure widget always exits streaming state
  if (!endOrErrorCalled) {
    callbacks.onEnd(null);
  }
}
