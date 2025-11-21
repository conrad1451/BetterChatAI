export interface ChatHistoryItem {
  id: string; // Used for React keys
  role: "user" | "ai"; // To determine styling/alignment
  text: string;
  time: Date;
}

export interface WebFormProps {
  onSubmit: (formData: { myPrompt: string }) => Promise<void>;
  promptHistory: ChatHistoryItem[];
  //   promptHistory: string[];
}

export interface AIMessage {
  // Define the structure of your API response here
  content: string;
  reasoning_content: string;
  refusal: undefined;
  role: string;
  // ... other properties
}

export interface AIOutputChoice {
  // Define the structure of your API response here
  finish_reason: string;
  index: number;
  logprobs: undefined;
  message: AIMessage;
  // ... other properties
}

export interface UsageTracking {
  completion_tokens: number;
  prompt_tokens: number;
  total_tokens: number;
}

export interface ApiResponse {
  // Define the structure of your API response here
  choices: AIOutputChoice[];
  created: number;
  id: string;
  model: string;
  object: string;
  usage: UsageTracking;
  // ... other properties
}
