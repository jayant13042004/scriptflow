import type { AiService } from './aiService';
import { MockAiService } from './mockAiService';
import { MistralAiService } from './mistralAiService';
import { GeminiAiService } from './geminiAiService';
import { OpenAiCompatibleAiService } from './openAiCompatibleAiService';

export { BaseAiService, safeParseJSON } from './baseAiService';
export { MistralAiService } from './mistralAiService';
export { GeminiAiService } from './geminiAiService';
export { OpenAiCompatibleAiService } from './openAiCompatibleAiService';
export { MockAiService } from './mockAiService';

let instance: AiService | null = null;
let currentProvider: string | null = null;

/**
 * Resolves the appropriate AI Service based on environment configuration or auto-detection.
 * Default active provider is Mistral AI.
 * If provider rate limits or errors out, the service automatically cascades through backup models.
 */
export function getAiService(): AiService {
  const envProvider = (import.meta.env.VITE_AI_PROVIDER || '').toLowerCase().trim();
  const mistralKey = import.meta.env.VITE_MISTRAL_API_KEY || '';
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  const universalKey =
    import.meta.env.VITE_AI_API_KEY ||
    (typeof window !== 'undefined' ? localStorage.getItem('scriptflow_ai_api_key') : '') ||
    '';

  let provider = envProvider;
  if (!provider) {
    if (mistralKey) {
      provider = 'mistral';
    } else if (geminiKey) {
      provider = 'gemini';
    } else if (universalKey) {
      provider = 'mistral';
    } else {
      provider = 'mistral';
    }
  }

  if (instance && currentProvider === provider) {
    return instance;
  }

  currentProvider = provider;

  switch (provider) {
    case 'mock':
      instance = new MockAiService();
      break;

    case 'gemini':
      instance = new GeminiAiService();
      break;

    case 'openai':
    case 'groq':
    case 'openrouter':
    case 'deepseek':
      instance = new OpenAiCompatibleAiService({ providerName: provider });
      break;

    case 'mistral':
    default:
      instance = new MistralAiService();
      break;
  }

  return instance;
}

export function resetAiServiceInstance(): void {
  instance = null;
  currentProvider = null;
}
