import { BaseAiService } from './baseAiService';

export interface OpenAiCompatibleOptions {
  apiKey?: string;
  baseUrl?: string;
  defaultModel?: string;
  fallbackModels?: string[];
  providerName?: string;
}

/**
 * Universal OpenAI-compatible AI Service
 * Supports Groq, OpenAI, OpenRouter, DeepSeek, Together, or any custom API endpoint.
 * Includes cascading model fallback on rate limits (429).
 */
export class OpenAiCompatibleAiService extends BaseAiService {
  private apiKey: string;
  private baseUrl: string;
  private configuredModel: string;
  private fallbackModels: string[];
  private providerName: string;

  constructor(options: OpenAiCompatibleOptions = {}) {
    super();
    this.apiKey =
      options.apiKey ||
      import.meta.env.VITE_AI_API_KEY ||
      (typeof window !== 'undefined' ? localStorage.getItem('scriptflow_ai_api_key') || '' : '');

    this.providerName = options.providerName || import.meta.env.VITE_AI_PROVIDER || 'openai';

    // Base URL resolution
    const envBase = import.meta.env.VITE_AI_BASE_URL;
    if (options.baseUrl) {
      this.baseUrl = options.baseUrl.replace(/\/+$/, '');
    } else if (envBase) {
      this.baseUrl = envBase.replace(/\/+$/, '');
    } else if (this.providerName === 'groq') {
      this.baseUrl = 'https://api.groq.com/openai/v1';
    } else if (this.providerName === 'openrouter') {
      this.baseUrl = 'https://openrouter.ai/api/v1';
    } else if (this.providerName === 'deepseek') {
      this.baseUrl = 'https://api.deepseek.com/v1';
    } else {
      this.baseUrl = 'https://api.openai.com/v1';
    }

    // Default model resolution
    this.configuredModel =
      options.defaultModel ||
      import.meta.env.VITE_AI_MODEL ||
      (this.providerName === 'groq'
        ? 'llama-3.3-70b-versatile'
        : this.providerName === 'openrouter'
        ? 'meta-llama/llama-3.3-70b-instruct'
        : this.providerName === 'deepseek'
        ? 'deepseek-chat'
        : 'gpt-4o-mini');

    this.fallbackModels = options.fallbackModels || (
      this.providerName === 'groq'
        ? ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768']
        : this.providerName === 'openrouter'
        ? ['meta-llama/llama-3.3-70b-instruct', 'google/gemini-2.0-flash-001', 'mistralai/mistral-small-24b-instruct-2501']
        : ['gpt-4o-mini', 'gpt-4o', 'gpt-3.5-turbo']
    );
  }

  protected async callLlm(
    prompt: string,
    jsonMode: boolean = false,
    mode: 'fast' | 'quality' = 'quality'
  ): Promise<string> {
    if (!this.apiKey) {
      console.warn(`[${this.providerName}] API key not configured. Add VITE_AI_API_KEY to your .env file.`);
      return '';
    }

    const modelsToTry = Array.from(new Set([this.configuredModel, ...this.fallbackModels]));

    for (const model of modelsToTry) {
      try {
        const bodyPayload: any = {
          model: model,
          messages: [
            {
              role: 'system',
              content:
                'You are ScriptFlow, a professional AI scriptwriting assistant. Deliver high retention, engaging pacing, and strictly follow output format rules.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: mode === 'fast' ? 0.3 : 0.7,
        };

        if (jsonMode) {
          bodyPayload.response_format = { type: 'json_object' };
        }

        const response = await fetch(`${this.baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify(bodyPayload),
        });

        if (response.status === 429 || response.status === 503) {
          console.warn(`[${this.providerName}] Model ${model} reached rate limit (HTTP ${response.status}). Cascading to next fallback model...`);
          continue;
        }

        if (!response.ok) {
          const errText = await response.text();
          console.warn(`[${this.providerName}] Error on model ${model} (${response.status}):`, errText);
          continue;
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';
        if (content && content.trim()) {
          return content.trim();
        }
      } catch (err: any) {
        console.warn(`[${this.providerName}] Network error on model ${model}:`, err?.message || err);
      }
    }

    return '';
  }
}
