export interface SendMessageResponse {
  result: {
    response: string;
    usage: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
  };
  success: boolean;
}

export interface Message {
  id: number;
  type: 'system' | 'bot' | 'user';
  response: string;
}
