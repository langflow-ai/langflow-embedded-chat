export type ChatMessageType = {
    message: string;
    isSend: boolean;
    error?: boolean;
    bot_message_style?: React.CSSProperties;
    user_message_style?: React.CSSProperties;
    error_message_style?: React.CSSProperties;
  };


  export type ChatMessagePlaceholderType = {
    bot_message_style?: React.CSSProperties;
  };