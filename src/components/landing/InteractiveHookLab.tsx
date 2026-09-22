import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowRight, Flame, Clock, Zap } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useEditorStore } from '../../stores/editorStore';
import { getPlainTextFromHtml } from '../../lib/wordCount';

interface HookSample {
  formula: string;
  type: string;
  hookText: string;
  previewBody: string;
  bRollCue: string;
  retentionScore: number;
  wordCount: number;
  estimatedSeconds: number;
  whyItWorks: string;
}

interface NicheData {
  id: string;
  name: string;
  badge: string;
  hooks: HookSample[];
}

const NICHES: NicheData[] = [
  {
    id: 'tech',
    name: 'Tech & Software',
    badge: '💻 Tech / Coding',
    hooks: [
      {
        formula: 'The Contrarian Warning',
        type: 'Contrarian',
        hookText: 'Stop learning Python in 2026. Unless you understand this one fundamental shift...',
        previewBody: 'Every bootcamp tells you syntax is what gets you hired. But with AI agents writing 80% of boilerplate code, the highest-paid engineers aren\'t coders anymore—they are system architects. In this video, I\'ll break down the 3 skills you actually need.',
        bRollCue: '[B-ROLL: Rapid terminal scrolling code + split-screen showing salary comparison chart]',
        retentionScore: 96,
        wordCount: 56,
        estimatedSeconds: 22,
        whyItWorks: 'Directly challenges common knowledge, triggering instant curiosity before the viewer can swipe away.',
      },
      {
        formula: 'The Expensive Mistake',
        type: 'Mistake / Cost',
        hookText: 'This $14 tool saved my SaaS company $4,800 last month. Here is what happened...',
        previewBody: 'We were paying for three different cloud logging services that our team barely opened. Then we switched our entire architecture to a single open-source pipeline on a VPS.',
        bRollCue: '[B-ROLL: Screen recording of AWS bill drop + zoom on cost dashboard]',
        retentionScore: 92,
        wordCount: 41,
        estimatedSeconds: 16,
        whyItWorks: 'Specific numbers ($14 vs $4,800) give tangible stakes that make the advice immediately credible.',
      },
    ],
  },
  {
    id: 'finance',
    name: 'Finance & Business',
    badge: '📈 Finance / Money',
    hooks: [
      {
        formula: 'The Hidden Trap',
        type: 'Curiosity Gap',
        hookText: 'Your bank is legally allowed to take your money without asking. Most people have no clue.',
        previewBody: 'Under modern bail-in legislation, when a major commercial bank faces distress, uninsured deposits don\'t just get refunded—they can be converted into bank equity. Here is the exact clause you agreed to when opening your account.',
        bRollCue: '[B-ROLL: Highlight on tiny print terms and conditions PDF + bank vault graphic]',
        retentionScore: 98,
        wordCount: 48,
        estimatedSeconds: 19,
        whyItWorks: 'Taps into deep survival and financial preservation anxiety, virtually guaranteeing 30+ seconds of watch-time.',
      },
      {
        formula: 'The Counter-Intuitive Truth',
        type: 'Story Drop',
        hookText: 'I made $120,000 from a product with zero followers. The secret wasn\'t social media.',
        previewBody: 'Everyone tells you to build an audience for 2 years before launching. But we bypassed the algorithm entirely using automated cold ecosystem integrations.',
        bRollCue: '[B-ROLL: Stripe dashboard revenue graph climbing + over-the-shoulder typing]',
        retentionScore: 94,
        wordCount: 39,
        estimatedSeconds: 15,
        whyItWorks: 'Refutes the hardest part of business (building an audience), offering a tempting shortcut.',
      },
    ],
  },
  {
    id: 'storytelling',
    name: 'Video Essay / Story',
    badge: '🎬 Storytelling / Essay',
    hooks: [
      {
        formula: 'In Media Res (Action First)',
        type: 'High-Stakes Story',
        hookText: 'In 1999, one teenager wrote 200 lines of code that caused the music industry to lose $10 billion.',
        previewBody: 'Shawn Fanning had no venture capital, no fancy degree, and no business plan. He just wanted a way to trade MP3s with his dorm roommate. But within six months, Napster was downloaded by 80 million people, and record label executives were sweating on Capitol Hill.',
        bRollCue: '[B-ROLL: Archival VHS footage of 90s computers + news clips of court hearings]',
        retentionScore: 97,
        wordCount: 57,
        estimatedSeconds: 23,
        whyItWorks: 'Establishes a David vs. Goliath narrative in the first sentence with massive historical stakes.',
      },
      {
        formula: 'The Unsolved Paradox',
        type: 'Curiosity Mystery',
        hookText: 'Why did the world\'s happiest country just report the highest loneliness rate in Europe?',
        previewBody: 'Finland consistently ranks #1 in global happiness indexes. Yet when you walk down the streets of Helsinki in November, the reality tells a completely different story.',
        bRollCue: '[B-ROLL: Cinematic moody shots of snowy Helsinki streets + drone shot over misty pine forests]',
        retentionScore: 95,
        wordCount: 43,
        estimatedSeconds: 17,
        whyItWorks: 'Creates a cognitive dissonance paradox that the human brain urgently wants resolved.',
      },
    ],
  },
  {
    id: 'fitness',
    name: 'Fitness & Habits',
    badge: '⚡ Health / Habits',
    hooks: [
      {
        formula: 'The "Everything You Know is Backwards"',
        type: 'Contrarian',
        hookText: 'Waking up at 5:00 AM might actually be blunting your testosterone and muscle growth.',
        previewBody: 'Hustle culture made 5 AM wake-up calls a badge of honor. But if you went to sleep at midnight, that 5-hour sleep cycle is blunting your growth hormone release by nearly 70%. Here is what sleep science actually shows.',
        bRollCue: '[B-ROLL: Alarm clock ringing in dark room + hormone cycle sleep chart animation]',
        retentionScore: 95,
        wordCount: 51,
        estimatedSeconds: 20,
        whyItWorks: 'Attacks a popular self-improvement trope, making listeners question their entire routine.',
      },
    ],
  },
];

export const InteractiveHookLab: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { setContent, setTitle } = useEditorStore();

  const [selectedNicheIndex, setSelectedNicheIndex] = useState(0);
  const [selectedHookIndex, setSelectedHookIndex] = useState(0);

  const currentNiche = NICHES[selectedNicheIndex];
  const currentHook = currentNiche.hooks[selectedHookIndex] || currentNiche.hooks[0];

  const handleOpenInStudio = () => {
    // Pre-populate editor with this hook and script structure
    const fullScript = `<h1>${currentHook.formula} — ${currentNiche.name}</h1>
<p><strong>[HOOK — 0:00 to 0:${currentHook.estimatedSeconds.toString().padStart(2, '0')}]</strong></p>
<p><em>${currentHook.hookText}</em></p>
<p>${currentHook.bRollCue}</p>
<p>&nbsp;</p>
<p><strong>[BODY INTRO]</strong></p>
<p>${currentHook.previewBody}</p>
<p>&nbsp;</p>
<p><strong>[CORE VALUE POINTS]</strong></p>
<p>• Point 1: The root misconception...</p>
<p>• Point 2: The step-by-step breakdown...</p>
<p>• Point 3: What to do today...</p>
<p>&nbsp;</p>
<p><strong>[CALL TO ACTION]</strong></p>
<p>If you want the full breakdown sheet, check the link in the description and subscribe for next week's deep dive.</p>`;

    const plainText = getPlainTextFromHtml(fullScript);
    setTitle(`${currentHook.formula} Script`);
    setContent(null, fullScript, plainText);

    if (isAuthenticated) {
      navigate('/editor');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-12 bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
      {/* Top Banner Header */}
      <div className="px-6 py-5 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-amber-300">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold tracking-tight">Interactive Hook & Retention Lab</h3>
              <span className="text-[11px] font-medium bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
                Live Preview
              </span>
            </div>
            <p className="text-xs text-gray-300">
              The first 3 seconds decide 80% of your video's retention. Test proven formulas below.
            </p>
          </div>
        </div>

        {/* Niche Selector Pills */}
        <div className="flex flex-wrap gap-1.5">
          {NICHES.map((niche, idx) => (
            <button
              key={niche.id}
              onClick={() => {
                setSelectedNicheIndex(idx);
                setSelectedHookIndex(0);
              }}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all duration-150 ${
                selectedNicheIndex === idx
                  ? 'bg-white text-gray-900 shadow-sm font-semibold'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {niche.badge}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="p-6 md:p-8 grid lg:grid-cols-12 gap-6 bg-gray-50/50">
        {/* Left Column: Hook Variations (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Choose Hook Formula
          </div>
          {currentNiche.hooks.map((hook, idx) => (
            <button
              key={hook.formula}
              onClick={() => setSelectedHookIndex(idx)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                selectedHookIndex === idx
                  ? 'bg-white border-gray-900 shadow-md ring-1 ring-gray-900/10'
                  : 'bg-white/60 border-gray-200 hover:border-gray-300 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  {hook.type}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <Zap className="w-3 h-3" />
                  {hook.retentionScore}/100
                </span>
              </div>
              <div className="text-sm font-semibold text-gray-900 mb-1">
                {hook.formula}
              </div>
              <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                "{hook.hookText}"
              </p>
            </button>
          ))}

          {/* Quick Tip Box */}
          <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
            <span className="font-semibold block mb-0.5">🧠 Why this formula works:</span>
            {currentHook.whyItWorks}
          </div>
        </div>

        {/* Right Column: Live Script & Production Dual-View (8 cols) */}
        <div className="lg:col-span-8 flex flex-col justify-between bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div>
            {/* Metric Status Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100 mb-5">
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1 font-medium text-gray-900">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  ~{currentHook.estimatedSeconds}s spoken intro
                </span>
                <span>•</span>
                <span>{currentHook.wordCount} words</span>
                <span>•</span>
                <span className="text-emerald-600 font-medium">150 WPM pacing</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-700">Retention Score:</span>
                <div className="w-24 bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${currentHook.retentionScore}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-emerald-600">{currentHook.retentionScore}%</span>
              </div>
            </div>

            {/* Script Text Preview */}
            <div className="space-y-4">
              {/* The Hook */}
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-purple-700 mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                  OPENING HOOK (FIRST 3-5 SECONDS)
                </div>
                <div className="text-lg font-serif font-bold text-gray-900 bg-purple-50/40 p-3.5 rounded-xl border border-purple-100 leading-snug">
                  "{currentHook.hookText}"
                </div>
              </div>

              {/* B-Roll Sync Cue */}
              <div className="text-xs font-mono text-gray-600 bg-gray-100 px-3 py-2 rounded-lg border border-gray-200">
                <span className="font-bold text-gray-800">SYNCED B-ROLL:</span> {currentHook.bRollCue}
              </div>

              {/* Body Setup */}
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Retention Bridge & Context
                </div>
                <p className="text-sm font-serif text-gray-700 leading-relaxed">
                  {currentHook.previewBody}
                </p>
              </div>
            </div>
          </div>

          {/* Action CTA Button */}
          <div className="pt-6 mt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-gray-400">
              ⚡ Preloads this hook, camera notes & speaking pacing directly into the Studio.
            </div>
            <button
              onClick={handleOpenInStudio}
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-white bg-gray-900 hover:bg-gray-800 rounded-xl transition-all duration-150 flex items-center justify-center gap-2 shadow-sm active:scale-95"
            >
              Open This Script in Studio
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
