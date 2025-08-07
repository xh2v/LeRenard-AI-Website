const MODELS: Record<string, { maxTokens: number, description: string }> = {
  '@cf/mistral/mistral-7b-instruct-v0.2': {
    maxTokens: 8192,
    description: 'The latest Mistral instruct model'
  },
  '@cf/meta/llama-3-8b-instruct': {
    maxTokens: 8192,
    description: 'The latest Llama model from Meta, optimized for instructions'
  },
  '@cf/mistral/mixtral-8x7b-instruct-v0.1': {
    maxTokens: 32768,
    description: 'A Mixture of Experts model with 8x7B parameters'
  },
  '@cf/google/gemma-7b-it-lora': {
    maxTokens: 8192,
    description: 'Gemma model from Google, optimized for conversations'
  }
};
