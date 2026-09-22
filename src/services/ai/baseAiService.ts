import type {
  AiService,
  ImproveTextParams,
  GenerateScriptParams,
  RepurposeParams,
  AskParams,
  AiTextResponse,
  AiGenerateResponse,
  TranscribeAudioParams,
  TranscribeAudioResponse,
  GenerateVideoIdeasParams,
  GenerateVideoIdeasResponse,
  GenerateThumbnailsParams,
  GenerateThumbnailsResponse,
  GenerateYoutubeMetadataParams,
  YoutubeMetadataResponse,
  SponsorBlockParams,
  SponsorBlockResponse,
  TranslateScriptParams,
  TranslateScriptResponse,
  ExtractShortsParams,
  ExtractShortsResponse,
  ConvertHandwritingParams,
  ConvertHandwritingResponse,
} from '../../types/ai';
import { MockAiService } from './mockAiService';

/**
 * Bulletproof JSON Parser for AI LLM outputs
 */
export function safeParseJSON<T>(rawText: string, isArray: boolean = false): T {
  if (!rawText || rawText.trim() === '') {
    throw new Error('Input text is empty');
  }
  let cleaned = rawText.trim();

  // 1. Strip markdown code fences if present
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/i, '');
    cleaned = cleaned.replace(/\n?```$/i, '');
  }
  cleaned = cleaned.trim();

  // 2. Isolate the JSON boundaries
  const openBracket = isArray ? '[' : '{';
  const closeBracket = isArray ? ']' : '}';

  const startIdx = cleaned.indexOf(openBracket);
  const endIdx = cleaned.lastIndexOf(closeBracket);
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    cleaned = cleaned.substring(startIdx, endIdx + 1);
  }

  // 3. Attempt JSON parse
  try {
    return JSON.parse(cleaned) as T;
  } catch (error) {
    console.warn('Initial JSON parse failed. Attempting fallback parse...', error);
    try {
      const escapedCleaned = cleaned.replace(/(?<!\\)"/g, '\\"');
      return JSON.parse(escapedCleaned) as T;
    } catch {
      throw new Error(`JSON parsing failed: ${(error as Error).message}`);
    }
  }
}

/**
 * Base abstract AI Service providing standardized prompts and response processing.
 * Any model provider (Mistral, Gemini, OpenAI, Groq, OpenRouter) extends this.
 */
export abstract class BaseAiService implements AiService {
  protected fallbackService: MockAiService;

  constructor() {
    this.fallbackService = new MockAiService();
  }

  protected abstract callLlm(
    prompt: string,
    jsonMode: boolean,
    mode: 'fast' | 'quality'
  ): Promise<string>;

  protected callLlmVision?(
    prompt: string,
    imageBase64: string
  ): Promise<string>;

  async improveText(params: ImproveTextParams): Promise<AiTextResponse> {
    const prompt = `You are ScriptFlow, a professional AI scriptwriting assistant for content creators.
Selected text to improve: "${params.selectedText}"
Full script context: "${params.fullScriptContext || 'N/A'}"
Instruction: ${params.instruction}

CRITICAL RULES:
1. Rewrite or improve the selected text strictly adhering to the instruction.
2. Maintain natural creator tone, high retention, and engaging pacing.
3. Return ONLY the revised text. Do NOT include quotes, preambles, markdown code blocks, or extra commentary.`;

    const resultText = await this.callLlm(prompt, false, params.mode || 'quality');
    if (!resultText) {
      return this.fallbackService.improveText(params);
    }

    return { result: resultText.replace(/^["']|["']$/g, '') };
  }

  async generateScript(params: GenerateScriptParams): Promise<AiGenerateResponse> {
    const prompt = `You are ScriptFlow, an expert content creation AI.
Analyze the input data and return a structured script response.

INPUT SPECIFICATIONS:
- Topic/Idea: ${params.topic}
- Platform: ${params.platform}
- Content Type: ${params.contentType}
- Duration: ${params.duration}
- Tone: ${params.tone}
- Language: ${params.language || 'English'}
- Custom Instructions: ${params.customInstructions || 'None'}

CRITICAL FORMATTING RULES:
1. Output ONLY a valid JSON object matching the schema below.
2. Do NOT wrap your output in markdown code blocks.
3. Do NOT include any additional conversational preamble or commentary.
4. Any quotes inside JSON string values MUST be properly escaped.
5. Do NOT leave trailing commas.

Output JSON Schema:
{
  "hooks": ["hook option 1", "hook option 2", "hook option 3"],
  "script": "full complete written script text with logical section markers",
  "onScreenText": ["on-screen text 1", "on-screen text 2", "on-screen text 3"],
  "visualSuggestions": ["B-roll / visual cue 1", "B-roll / visual cue 2", "B-roll / visual cue 3"],
  "cta": "strong call to action text"
}`;

    const jsonText = await this.callLlm(prompt, true, params.mode || 'quality');
    if (jsonText) {
      try {
        const parsed = safeParseJSON<any>(jsonText, false);
        return {
          hooks: Array.isArray(parsed.hooks) ? parsed.hooks : [],
          script: parsed.script || '',
          onScreenText: Array.isArray(parsed.onScreenText) ? parsed.onScreenText : [],
          visualSuggestions: Array.isArray(parsed.visualSuggestions) ? parsed.visualSuggestions : [],
          cta: parsed.cta || '',
        };
      } catch (err) {
        console.error('Failed to parse AI script response:', err);
      }
    }

    return this.fallbackService.generateScript(params);
  }

  async repurpose(params: RepurposeParams): Promise<AiTextResponse> {
    const prompt = `You are ScriptFlow, a multi-platform content repurposing expert.
Original Script Title: "${params.scriptTitle}"
Original Script Content:
"${params.scriptContent}"

Target Format: ${params.targetFormat}

CRITICAL RULES:
1. Transform this script into the target format (e.g. X thread: numbered posts; LinkedIn: professional breakdown; Reel/Short/TikTok: timed hook & body; IG Carousel: slide text).
2. Return ONLY the formatted, ready-to-publish content without extra commentary.`;

    const resultText = await this.callLlm(prompt, false, params.mode || 'quality');
    if (!resultText) {
      return this.fallbackService.repurpose(params);
    }

    return { result: resultText };
  }

  async askAboutScript(params: AskParams): Promise<AiTextResponse> {
    const prompt = `You are ScriptFlow, a senior script editor and YouTube content strategist.
Script Context:
"${params.scriptContext}"

User Question: "${params.question}"

Provide a concise, direct, and actionable response focusing on retention, pacing, hook strength, and overall script quality.`;

    const resultText = await this.callLlm(prompt, false, params.mode || 'quality');
    if (!resultText) {
      return this.fallbackService.askAboutScript(params);
    }

    return { result: resultText };
  }

  async transcribeAudio(params: TranscribeAudioParams): Promise<TranscribeAudioResponse> {
    // If provider doesn't have custom audio, fallback to mock service (or SpeechRecognition in browser)
    return this.fallbackService.transcribeAudio(params);
  }

  async generateVideoIdeas(params: GenerateVideoIdeasParams): Promise<GenerateVideoIdeasResponse> {
    const scriptsSummary = params.pastScripts
      .slice(0, 15)
      .map(
        (s, i) =>
          `Script ${i + 1}: "${s.title}" (${s.contentType || 'General'}, ${s.platform || 'YouTube'})\nExcerpt: ${
            s.plainText?.slice(0, 200) || 'None'
          }`
      )
      .join('\n\n');

    const prompt = `You are a world-class YouTube viral content strategist.
Analyze the creator's past scripts below to identify their exact niche, target audience, and creator style.
Then brainstorm 6 to 10 highly engaging, high-CTR video ideas that fit naturally into their content channel.

CREATOR'S PAST SCRIPTS:
${scriptsSummary}

Output ONLY valid JSON matching this schema:
{
  "detectedNiche": "e.g. Creator Economy & Video Production",
  "creatorStyle": "e.g. Punchy, actionable storytelling with practical breakdowns",
  "ideas": [
    {
      "id": "idea-1",
      "title": "High-CTR, viral YouTube video title",
      "hook": "Compelling 5-second opening hook line",
      "angle": "Why this video will blow up in their niche based on past audience trends",
      "format": "Tutorial / Breakdown / Story / Case Study"
    }
  ]
}`;

    const jsonText = await this.callLlm(prompt, true, 'quality');
    if (jsonText) {
      const parsed = safeParseJSON<GenerateVideoIdeasResponse>(jsonText);
      if (parsed?.ideas && parsed.ideas.length > 0) {
        return parsed;
      }
    }

    return this.fallbackService.generateVideoIdeas
      ? this.fallbackService.generateVideoIdeas(params)
      : {
          detectedNiche: 'Digital Content Creation',
          creatorStyle: 'Engaging & Direct',
          ideas: [],
        };
  }

  async generateThumbnailConcepts(params: GenerateThumbnailsParams): Promise<GenerateThumbnailsResponse> {
    const prompt = `You are a YouTube thumbnail artist and viral packaging designer.
Analyze the video title and script context below.
Create 3 high-contrast, click-worthy thumbnail concepts.

Video Title: "${params.title}"
Script Context:
${params.scriptContext.slice(0, 1500)}

Output ONLY valid JSON matching this schema:
{
  "concepts": [
    {
      "id": "concept-1",
      "visualTitle": "Short catchy angle for this visual",
      "sceneDescription": "Exact visual scene layout, characters, foreground and background elements",
      "subjectEmotion": "Facial expression and eye direction (e.g. shock looking right, intense focus)",
      "colorContrast": "High-contrast color scheme (e.g. Neon yellow foreground on dark navy background)",
      "textOverlay": "2 to 4 words MAX bold text to place on the thumbnail (do not repeat the title)"
    }
  ]
}`;

    const jsonText = await this.callLlm(prompt, true, 'quality');
    if (jsonText) {
      const parsed = safeParseJSON<GenerateThumbnailsResponse>(jsonText);
      if (parsed?.concepts && parsed.concepts.length > 0) return parsed;
    }

    return this.fallbackService.generateThumbnailConcepts
      ? this.fallbackService.generateThumbnailConcepts(params)
      : { concepts: [] };
  }

  async generateYoutubeMetadata(params: GenerateYoutubeMetadataParams): Promise<YoutubeMetadataResponse> {
    const prompt = `You are a YouTube SEO expert.
Generate complete YouTube Studio video metadata for the script below:
1. A compelling 2-sentence hook description above the fold.
2. An engaging full video description.
3. Realistic timestamps/chapters starting at 0:00.
4. 15-20 comma-separated SEO keywords/tags.
5. 3-5 trending hashtags.

Video Title: "${params.title}"
Script Content:
${params.scriptContext.slice(0, 3000)}

Output ONLY valid JSON matching this schema:
{
  "shortHookSummary": "First 2 lines above the fold for maximum CTR",
  "fullDescription": "Full formatted YouTube description with emojis, summary, and links placeholders",
  "chapters": [
    { "timestamp": "0:00", "title": "Intro Hook" },
    { "timestamp": "0:45", "title": "The Problem" }
  ],
  "tags": ["tag1", "tag2", "tag3"],
  "hashtags": ["#tag1", "#tag2", "#tag3"]
}`;

    const jsonText = await this.callLlm(prompt, true, 'quality');
    if (jsonText) {
      const parsed = safeParseJSON<YoutubeMetadataResponse>(jsonText);
      if (parsed?.tags) return parsed;
    }

    return this.fallbackService.generateYoutubeMetadata
      ? this.fallbackService.generateYoutubeMetadata(params)
      : {
          shortHookSummary: '',
          fullDescription: '',
          chapters: [],
          tags: [],
          hashtags: [],
        };
  }

  async generateSponsorBlock(params: SponsorBlockParams): Promise<SponsorBlockResponse> {
    const prompt = `You are an elite video scriptwriter.
Write an authentic, seamless 45-60s sponsorship read for a YouTube video.
The transition from the creator's content into the sponsor MUST be organic and natural (not jarring or awkward).

Brand: ${params.brandName}
Promo Link / Code: ${params.sponsorUrl || params.promoCode || 'link in description'}
Talking Points: ${params.talkingPoints}
Placement Style: ${params.placement}
Current Script Context:
${params.currentScriptContext.slice(0, 1500)}

Output ONLY valid JSON matching this schema:
{
  "introTransition": "Smooth bridge from content to brand",
  "sponsorRead": "Engaging 45-60s spoken ad delivery covering key benefits & promo code",
  "outroTransition": "Smooth return back into the main video content",
  "fullSponsorBlock": "Full combined text ready to speak"
}`;

    const jsonText = await this.callLlm(prompt, true, 'quality');
    if (jsonText) {
      const parsed = safeParseJSON<SponsorBlockResponse>(jsonText);
      if (parsed?.fullSponsorBlock) return parsed;
    }

    return this.fallbackService.generateSponsorBlock
      ? this.fallbackService.generateSponsorBlock(params)
      : {
          introTransition: '',
          sponsorRead: '',
          outroTransition: '',
          fullSponsorBlock: '',
        };
  }

  async translateScript(params: TranslateScriptParams): Promise<TranslateScriptResponse> {
    const prompt = `You are a professional multilingual voiceover and dubbing translator.
Translate the following video script into natural, spoken ${params.targetLanguage}.
Ensure phrasing and sentence rhythm sound natural when read aloud for voiceover and dubbing.

Script to translate:
${params.scriptText}

Output ONLY valid JSON matching this schema:
{
  "translatedText": "Full translated spoken script",
  "targetLanguage": "${params.targetLanguage}",
  "pronunciationNotes": "Optional brief delivery or cultural adaptation notes"
}`;

    const jsonText = await this.callLlm(prompt, true, 'quality');
    if (jsonText) {
      const parsed = safeParseJSON<TranslateScriptResponse>(jsonText);
      if (parsed?.translatedText) return parsed;
    }

    return this.fallbackService.translateScript
      ? this.fallbackService.translateScript(params)
      : {
          translatedText: params.scriptText,
          targetLanguage: params.targetLanguage,
        };
  }

  async extractViralShorts(params: ExtractShortsParams): Promise<ExtractShortsResponse> {
    const prompt = `You are a viral YouTube Shorts and TikTok growth strategist.
Analyze the long-form script below and extract the top 2-3 most viral, high-retention 45-60 second standalone Shorts / Reels.
Each short MUST have:
1. High-curiosity opening Hook.
2. Fast, punchy storytelling (120-150 words).
3. Visual / B-Roll cues for vertical video.

Long Script Title: "${params.longScriptTitle}"
Long Script Content:
${params.longScriptText.slice(0, 3500)}

Output ONLY valid JSON matching this schema:
{
  "shorts": [
    {
      "id": "short-1",
      "title": "Viral Short Title",
      "hook": "5-second vertical hook",
      "scriptText": "Complete 45-60s spoken script text",
      "visualCues": "Fast cuts, zoom in, text on screen tips",
      "estimatedDuration": 50
    }
  ]
}`;

    const jsonText = await this.callLlm(prompt, true, 'quality');
    if (jsonText) {
      const parsed = safeParseJSON<ExtractShortsResponse>(jsonText);
      if (parsed?.shorts && parsed.shorts.length > 0) return parsed;
    }

    return this.fallbackService.extractViralShorts
      ? this.fallbackService.extractViralShorts(params)
      : { shorts: [] };
  }

  async convertHandwritingToText(params: ConvertHandwritingParams): Promise<ConvertHandwritingResponse> {
    if (this.callLlmVision) {
      const prompt = 'You are an optical character recognition and handwriting transcription expert. Read and transcribe all handwritten text or notes drawn in this canvas image accurately. Return ONLY the transcribed text, preserving paragraph breaks, lists, and structure. Do not wrap in markdown quotes or preamble.';
      const res = await this.callLlmVision(prompt, params.imageBase64);
      if (res) return { recognizedText: res.trim() };
    }
    return this.fallbackService.convertHandwritingToText
      ? this.fallbackService.convertHandwritingToText(params)
      : { recognizedText: '' };
  }
}
