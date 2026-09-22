import { BaseAiService } from './baseAiService';

/**
 * Mistral AI Service
 * Supports auto-cascading fallback across models when rate limits (HTTP 429)
 * or quotas are encountered.
 */
export class MistralAiService extends BaseAiService {
  private apiKey: string;
  private configuredModel: string;
  private baseUrl: string;

  constructor() {
    super();
    this.apiKey =
      import.meta.env.VITE_MISTRAL_API_KEY ||
      import.meta.env.VITE_AI_API_KEY ||
      (typeof window !== 'undefined' ? localStorage.getItem('scriptflow_ai_api_key') || '' : '');

    this.configuredModel =
      import.meta.env.VITE_MISTRAL_MODEL ||
      import.meta.env.VITE_AI_MODEL ||
      'mistral-small-latest';

    const customBase = import.meta.env.VITE_MISTRAL_BASE_URL || import.meta.env.VITE_AI_BASE_URL;
    this.baseUrl = (customBase || 'https://api.mistral.ai/v1').replace(/\/+$/, '');
  }

  /**
   * Cascading LLM execution across Mistral models with automatic rate limit fallback
   */
  protected async callLlm(
    prompt: string,
    jsonMode: boolean = false,
    mode: 'fast' | 'quality' = 'quality'
  ): Promise<string> {
    if (!this.apiKey) {
      console.warn('Mistral API key is not configured. Add VITE_MISTRAL_API_KEY to your .env file.');
      return '';
    }

    // Curated Mistral model cascade
    // If the top model is busy or hits rate limits, immediately fallback to next
    const fastCascade = [
      this.configuredModel,
      'mistral-small-latest',
      'open-mistral-nemo',
      'mistral-medium-latest',
      'codestral-latest',
    ];

    const qualityCascade = [
      this.configuredModel,
      'mistral-large-latest',
      'mistral-small-latest',
      'open-mistral-nemo',
      'mistral-medium-latest',
    ];

    const modelsToTry = Array.from(new Set(mode === 'fast' ? fastCascade : qualityCascade));

    // Try primary endpoint first, with local proxy fallback in development if browser CORS blocks
    const endpointsToTry = [
      `${this.baseUrl}/chat/completions`,
      '/api/mistral/v1/chat/completions',
    ];

    for (const model of modelsToTry) {
      for (const endpoint of endpointsToTry) {
        try {
          const bodyPayload: any = {
            model: model,
            messages: [
              {
                role: 'system',
                content:
                  'You are ScriptFlow, an elite AI scriptwriting assistant for top video creators. Deliver high retention, engaging pacing, and strictly adhere to requested output formats.',
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

          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify(bodyPayload),
          });

          // If rate limit (429) or temporary server overload (503), break to next model in cascade!
          if (response.status === 429 || response.status === 503) {
            console.warn(`Mistral model ${model} hit rate limit / capacity (HTTP ${response.status}). Cascading to next fallback model...`);
            break; // try next model
          }

          if (!response.ok) {
            const errText = await response.text();
            console.warn(`Mistral API call error for model ${model} at ${endpoint} (${response.status}):`, errText);
            // If CORS or 404 on direct url, try secondary proxy endpoint
            continue;
          }

          const data = await response.json();
          const content = data.choices?.[0]?.message?.content || '';
          if (content && content.trim()) {
            return content.trim();
          }
        } catch (err: any) {
          console.warn(`Network/fetch notice for Mistral model ${model} at ${endpoint}:`, err?.message || err);
        }
      }
    }

    console.warn('All Mistral models in cascade exhausted. Falling back to local assistant.');
    return '';
  }

  /**
   * Multimodal Vision (Canvas OCR via Pixtral models)
   */
  protected async callLlmVision(prompt: string, imageBase64: string): Promise<string> {
    if (!this.apiKey) return '';

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const visionModels = ['pixtral-12b-2409', 'pixtral-large-latest', 'mistral-small-latest'];

    for (const model of visionModels) {
      try {
        const response = await fetch(`${this.baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: 'user',
                content: [
                  { type: 'text', text: prompt },
                  {
                    type: 'image_url',
                    image_url: `data:image/png;base64,${cleanBase64}`,
                  },
                ],
              },
            ],
            temperature: 0.1,
          }),
        });

        if (!response.ok) continue;
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';
        if (content) return content.trim();
      } catch (e) {
        console.warn(`Vision OCR notice on model ${model}:`, e);
      }
    }

    return '';
  }
}
