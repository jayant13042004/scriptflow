import React, { useState } from 'react';
import {
  PenLine, Clapperboard, Mic, Tv, RefreshCw, CheckCircle2,
  Sparkles, ArrowRight, Play, Eye, Layers, Copy, Sliders
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../../stores/authStore';

interface TabItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  badge: string;
}

const TABS: TabItem[] = [
  {
    id: 'av-scripting',
    title: 'Dual-Column AV & B-Roll',
    subtitle: 'Direct visual cues alongside your words',
    icon: Clapperboard,
    badge: 'Production Moat',
  },
  {
    id: 'voice-mode',
    title: 'Speech-to-Script Voice Mode',
    subtitle: 'Talk naturally. Let AI format your video',
    icon: Mic,
    badge: 'Zero Friction',
  },
  {
    id: 'teleprompter',
    title: 'Studio Glass Teleprompter',
    subtitle: 'Never stumble or memorize lines on camera',
    icon: Tv,
    badge: 'Hardware Ready',
  },
  {
    id: 'repurpose',
    title: '1-Click Multi-Format Engine',
    subtitle: '1 Video → 3 Shorts + Thread + Newsletter',
    icon: RefreshCw,
    badge: 'Growth Multiplier',
  },
];

export const CreatorWorkflowTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('av-scripting');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const handleStart = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-16 px-4">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
          The Creator Pre-Production OS
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 mt-3 mb-4">
          Everything you need before hitting record.
        </h2>
        <p className="text-base sm:text-lg text-gray-500">
          General text editors like Google Docs and Notion are built for office meetings. ScriptFlow is built for the camera.
        </p>
      </div>

      {/* Tab Navigation Pill Row */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-gray-500'}`} />
              <span>{tab.title}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Display Container */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
        {/* Tab 1: Dual-Column AV & B-Roll */}
        {activeTab === 'av-scripting' && (
          <div className="p-6 sm:p-10 grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                Stop Guessing B-Roll on Set
              </span>
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight leading-snug">
                Audio & Visual Direction in One Unified Script
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Top YouTubers never write pure blocks of text. They map every sentence to camera switches, on-screen text overlays, and sound effects before filming.
              </p>
              <ul className="space-y-2.5 text-xs text-gray-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Automatic duration calculation (WPM) per section</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Tag camera angles: A-Cam (Host), B-Roll overlay, Screen capture</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Color-coded visual cues so you never film shots out of order</span>
                </li>
              </ul>
              <button
                onClick={handleStart}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-gray-900 hover:bg-gray-800 rounded-xl transition-all flex items-center gap-2"
              >
                Try the AV Planner Free
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="lg:col-span-7 bg-gray-950 rounded-2xl p-4 sm:p-6 text-gray-200 font-mono text-xs shadow-inner">
              <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-4 text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  <span className="text-[11px] ml-2 text-gray-300">AV Script Planner · 1080p 60fps</span>
                </div>
                <span className="text-emerald-400 font-semibold text-[11px]">Est. Length: 8m 45s</span>
              </div>

              {/* Mock AV Rows */}
              <div className="space-y-3 font-sans">
                {/* Shot 1 */}
                <div className="grid grid-cols-12 gap-3 p-3 bg-gray-900/90 rounded-xl border border-gray-800">
                  <div className="col-span-4 border-r border-gray-800 pr-2">
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block mb-1">
                      A-Cam (Close-up)
                    </span>
                    <p className="text-[11px] text-gray-300 font-mono">
                      [GRAPHIC: Title slide drops in with whoosh SFX]
                    </p>
                    <span className="text-[10px] text-gray-500 mt-2 block">Duration: 0:14s</span>
                  </div>
                  <div className="col-span-8 pl-1">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                      Spoken Audio
                    </span>
                    <p className="text-xs text-gray-200 leading-relaxed font-serif">
                      "If you build digital products in 2026, you are making one of three critical mistakes. And the first one is costing you thousands."
                    </p>
                  </div>
                </div>

                {/* Shot 2 */}
                <div className="grid grid-cols-12 gap-3 p-3 bg-gray-900/90 rounded-xl border border-gray-800">
                  <div className="col-span-4 border-r border-gray-800 pr-2">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block mb-1">
                      B-Roll Overlay
                    </span>
                    <p className="text-[11px] text-gray-300 font-mono">
                      [B-ROLL: Slow-motion typing on mechanical keyboard + coffee steam]
                    </p>
                    <span className="text-[10px] text-gray-500 mt-2 block">Duration: 0:28s</span>
                  </div>
                  <div className="col-span-8 pl-1">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                      Voiceover
                    </span>
                    <p className="text-xs text-gray-200 leading-relaxed font-serif">
                      "Most founders start by coding a database before talking to a single customer. But the fastest-growing solo businesses start with one page..."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Voice Dictation */}
        {activeTab === 'voice-mode' && (
          <div className="p-6 sm:p-10 grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                Kill Blank Page Anxiety
              </span>
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight leading-snug">
                Talk Your Thoughts. Our AI Turns It Into a Clean Video Script.
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Staring at a blank blinking cursor is the biggest obstacle for video creators. Press record, talk out your messy unedited ideas for 3 minutes, and watch ScriptFlow structure it into:
              </p>
              <ul className="space-y-2 text-xs text-gray-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>A punchy 3-second opening hook</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Logical numbered core argument points</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Automatic B-Roll suggestions based on what you said</span>
                </li>
              </ul>
              <button
                onClick={handleStart}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-gray-900 hover:bg-gray-800 rounded-xl transition-all flex items-center gap-2"
              >
                Try Voice Dictation
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="lg:col-span-7 bg-gray-50 rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse"></div>
                  <span className="text-xs font-semibold text-gray-800">Live Speech-to-Script Engine</span>
                </div>
                <span className="text-xs text-rose-600 font-mono font-medium">Recording: 01:24</span>
              </div>

              {/* Spoken Rambling */}
              <div className="p-3 bg-white rounded-xl border border-gray-200 text-xs text-gray-500 italic">
                "Uh, so basically I wanted to talk about why most people fail when learning Next.js... like they jump straight into server actions and get confused by cookies and auth..."
              </div>

              {/* Arrow transformation */}
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-purple-700 py-1">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>ScriptFlow AI Structured Transformation</span>
              </div>

              {/* Formatted Script */}
              <div className="p-4 bg-white rounded-xl border border-purple-200 shadow-sm space-y-2 text-xs">
                <div className="font-bold text-gray-900">[VIRAL HOOK]</div>
                <p className="text-gray-700 font-serif">
                  "Next.js isn't hard. The way it's taught is broken. Here is the one server architecture concept you actually need."
                </p>
                <div className="font-bold text-gray-900 mt-2">[SHOT 1 · DIAGRAM OVERLAY]</div>
                <p className="text-gray-600 text-[11px] font-mono">
                  [B-ROLL: Client-side vs Server Component boundary diagram zoom]
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Studio Teleprompter */}
        {activeTab === 'teleprompter' && (
          <div className="p-6 sm:p-10 grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                Hardware Rig Ready
              </span>
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight leading-snug">
                Fullscreen Pro Teleprompter with Glass Mirroring
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Ditch flimsy mobile teleprompter apps that cost \$15/month. ScriptFlow features a built-in professional teleprompter engine engineered directly into your browser:
              </p>
              <ul className="space-y-2 text-xs text-gray-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Mirror Flip (Horizontal & Vertical)</strong> for physical 70/30 beam-splitter glass rigs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Smooth <code>requestAnimationFrame</code> scroll at 60–300 WPM</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Eye-line focus guide bar so you look straight into the lens</span>
                </li>
              </ul>
              <button
                onClick={handleStart}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-gray-900 hover:bg-gray-800 rounded-xl transition-all flex items-center gap-2"
              >
                Open Teleprompter Free
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="lg:col-span-7 bg-black rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden border border-gray-800">
              <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold tracking-wider text-amber-400">TELEPROMPTER STUDIO</span>
                  <span className="text-[10px] bg-gray-800 text-gray-300 px-2 py-0.5 rounded">Mirror Glass: ON</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                  <span>Speed: 145 WPM</span>
                  <span className="text-gray-600">|</span>
                  <span>Space = Pause</span>
                </div>
              </div>

              {/* Eye line focus bar */}
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-16 border-y-2 border-amber-400/40 bg-amber-400/5 pointer-events-none z-10 flex items-center justify-end px-4">
                <span className="text-[10px] text-amber-300/80 font-mono tracking-widest uppercase">
                  ← EYE-LEVEL FOCUS LINE
                </span>
              </div>

              {/* Mock scrolling prompter text */}
              <div className="space-y-6 py-8 text-center font-sans">
                <p className="text-sm text-gray-600">
                  Welcome back to the studio. In this episode...
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-white tracking-wide leading-tight">
                  What if everything you know about productivity is fundamentally wrong?
                </p>
                <p className="text-lg text-gray-400 leading-relaxed">
                  Most people think being productive means working twelve hours a day. But the best creators do less.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: 1-Click Repurposing */}
        {activeTab === 'repurpose' && (
          <div className="p-6 sm:p-10 grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                1 Script = 6 Assets
              </span>
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight leading-snug">
                One Master Script. Published Everywhere in Seconds.
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Stop spending 3 hours rewriting your YouTube script for social media. With one click, ScriptFlow parses your core arguments and generates:
              </p>
              <ul className="space-y-2 text-xs text-gray-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>3 Short-Form Scripts</strong> formatted for 9:16 TikTok & YouTube Shorts</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>An X Thread / LinkedIn Carousel</strong> breaking down key frameworks</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>SEO YouTube Chapters & Description</strong> with timestamp placeholders</span>
                </li>
              </ul>
              <button
                onClick={handleStart}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-gray-900 hover:bg-gray-800 rounded-xl transition-all flex items-center gap-2"
              >
                Repurpose Your Script Now
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-3">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-red-600">YouTube Shorts (9:16)</span>
                  <Copy className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-600 leading-relaxed line-clamp-4">
                  "Stop learning Python in 2026. Here's why: 80% of boilerplate code is now handled by agents. What gets you hired is..."
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-blue-600">X (Twitter) Thread</span>
                  <Copy className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-600 leading-relaxed line-clamp-4">
                  "1/8: Most engineers are preparing for the wrong tech jobs in 2026. Here are the 3 non-negotiable architectural skills..."
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-blue-700">LinkedIn Post</span>
                  <Copy className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-600 leading-relaxed line-clamp-4">
                  "The definition of 'developer productivity' just changed forever. If your team is still measuring lines of code..."
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-emerald-700">Newsletter Issue</span>
                  <Copy className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-600 leading-relaxed line-clamp-4">
                  "Hey creators, this week we dove into retention curve drops. Here's the 3-part framework we used to boost watch time by 40%..."
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
