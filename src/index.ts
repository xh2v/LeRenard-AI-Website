const MODELS: Record<string, { maxTokens: number, description: string }> = {
  '@cf/meta/llama-3.2-3b-instruct': {
    maxTokens: 8192,
    description: 'Meta LLaMA 3.2 - 3B Instruct model, ideal for lightweight instruction-following'
  },
  '@cf/meta/llama-3.2-11b-vision-instruct': {
    maxTokens: 8192,
    description: 'Meta LLaMA 3.2 - 11B Vision Instruct model with multimodal support (text + image)'
  },
  '@cf/google/gemma-3-12b-it': {
    maxTokens: 8192,
    description: 'Google Gemma 3 - 12B Instruction-Tuned model, optimized for helpful dialog'
  },
  'deepseek-math-7b-instruct': {
    maxTokens: 8192,
    description: 'DeepSeek Math 7B - specialized in solving math problems and reasoning'
  }
};
