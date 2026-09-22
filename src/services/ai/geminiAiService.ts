import { BaseAiService, safeParseJSON } from './baseAiService';
import type { TranscribeAudioParams, TranscribeAudioResponse } from '../../types/ai';

export { safeParseJSON };

export class GeminiAiService extends BaseAiService {
  private apiKey: string;
  private modelName: string;

  constructor() {
    super();
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_AI_API_KEY || '';
    this.modelName = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash';
  }

  protected async callLlm(
    prompt: string,
    jsonMode: boolean = false,
    mode: 'fast' | 'quality' = 'quality'
  ): Promise<string> {
    if (!this.apiKey) {
      console.warn('Gemini API key is not configured. Falling back to mock AI service.');
      return '';
    }

    // Supported active production models with cascading fallback on rate limit / error
    const fastModels = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-3.5-flash-lite', 'gemini-3.6-flash'];
    const qualityModels = [this.modelName, 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-3.1-pro', 'gemini-1.5-flash'];

    const modelsToTry = Array.from(new Set(mode === 'fast' ? fastModels : qualityModels));

    for (const model of modelsToTry) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;

        const payload: any = {
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: mode === 'fast' ? 0.4 : 0.7,
            maxOutputTokens: mode === 'fast' ? 2048 : 4096,
          },
        };

        if (jsonMode) {
          payload.generationConfig.responseMimeType = 'application/json';
        }

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (response.status === 429 || response.status === 503) {
          console.warn(`Gemini model ${model} reached rate limit (HTTP ${response.status}). Cascading to next fallback model...`);
          continue;
        }

        if (!response.ok) {
          const errText = await response.text();
          console.warn(`Gemini API call failed for model ${model} (${response.status}):`, errText);
          continue;
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (text) return text.trim();
      } catch (err) {
        console.warn(`Error calling Gemini model ${model}:`, err);
      }
    }

    return '';
  }

  override async transcribeAudio(params: TranscribeAudioParams): Promise<TranscribeAudioResponse> {
    if (!this.apiKey) {
      return this.fallbackService.transcribeAudio(params);
    }

    const modelsToTry = [
      this.modelName,
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-1.5-flash',
    ].filter((value, index, self) => self.indexOf(value) === index);

    const prompt = `You are ScriptFlow Voice Engine. Listen to this spoken audio recording from a content creator.
1. Transcribe what they said as accurately as possible under the "transcript" key.
2. Structure their thoughts into a clean, engaging video script (with Hook, Core Points, Visual Notes, and Call to Action) under the "structuredScript" key.

Return JSON in this format:
{
  "transcript": "...",
  "structuredScript": "..."
}`;

    for (const model of modelsToTry) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;
        const payload: any = {
          contents: [
            {
              parts: [
                {
                  inlineData: {
                    mimeType: params.mimeType || 'audio/webm',
                    data: params.audioBase64,
                  },
                },
                { text: prompt },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.4,
          },
        };

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) continue;

        const data = await response.json();
        const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (rawJson) {
          const parsed = safeParseJSON<TranscribeAudioResponse>(rawJson);
          return {
            transcript: parsed.transcript || '',
            structuredScript: parsed.structuredScript || '',
          };
        }
      } catch (err) {
        console.warn(`Error transcribing with model ${model}:`, err);
      }
    }

    return this.fallbackService.transcribeAudio(params);
  }

  protected override async callLlmVision(prompt: string, imageBase64: string): Promise<string> {
    if (!this.apiKey) return '';

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const payload = {
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: 'image/png',
                data: cleanBase64,
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 2048,
      },
    };

    const modelsToTry = [this.modelName, 'gemini-2.5-flash', 'gemini-2.0-flash'];

    for (const model of modelsToTry) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) continue;
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (text) return text.trim();
      } catch (e) {
        console.warn(`Gemini OCR notice on model ${model}:`, e);
      }
    }

    return '';
  }
}
