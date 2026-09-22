import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  PenLine, Sparkles, Lightbulb, BarChart3, Clapperboard,
  Layout, RefreshCw, ArrowRight, Check, ChevronRight,
  FileText, Zap, Shield, Tv, Mic, Video, Users, Star,
  HelpCircle, ChevronDown, CheckCircle2, Flame, Play
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useSEO } from '../hooks/useSEO';
import { InteractiveHookLab } from '../components/landing/InteractiveHookLab';
import { CreatorWorkflowTabs } from '../components/landing/CreatorWorkflowTabs';
import { CompetitorComparisonTable } from '../components/landing/CompetitorComparisonTable';

const PLATFORMS = [
  { name: 'YouTube', badge: 'YouTube Long-Form' },
  { name: 'Shorts', badge: 'YouTube Shorts' },
  { name: 'TikTok', badge: 'TikTok & Reels' },
  { name: 'Spotify', badge: 'Video Podcasts' },
  { name: 'LinkedIn', badge: 'Creator Newsletters' },
];

const TESTIMONIALS = [
  {
    name: 'Alex Rivera',
    channel: '@AlexBuildsTech',
    role: 'Tech YouTuber · 145K Subscribers',
    quote: 'I used to write scripts in Notion and guess B-roll on set. ScriptFlow cut my filming time in half because every line is already synced to a visual cue. Our first-30-second retention jumped from 38% to 54%.',
    metric: '+16% Retention',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
  },
  {
    name: 'Dr. Sarah Lin',
    channel: 'The Economics Lens',
    role: 'Video Essayist · 82K Subscribers',
    quote: 'The teleprompter glass mirror mode alone replaces three separate apps I was paying for. I rest my iPad under my 70/30 glass rig, set pacing to 145 WPM, and deliver 15-minute essays in a single flawless take.',
    metric: '1-Take Filming',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
  },
  {
    name: 'Marcus Vance',
    channel: '@VanceDaily',
    role: 'Short-Form Creator · 510K Across Platforms',
    quote: 'The voice mode is insane. I walk around the room speaking my raw unhinged thoughts into the mic. Our AI structures it into 3 tight 60-second scripts with hook variations before I even sit at my desk.',
    metric: '3x Output',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
  },
];

const FAQS = [
  {
    q: 'How is ScriptFlow different from Notion or Google Docs?',
    a: 'Notion and Google Docs are built for corporate meetings and team notes. They have no concept of video pacing (WPM speaking duration), no full-screen hardware-compatible teleprompter, no visual B-roll cues, and no viral hook templates. ScriptFlow is built from the ground up for the camera.',
  },
  {
    q: 'Can I use the teleprompter with a real camera and physical glass rig?',
    a: 'Yes! ScriptFlow includes both Horizontal (Flip X) and Vertical (Flip Y) mirror toggles. Place your laptop or iPad under any 70/30 beam-splitter prompter glass and the reflected text reads normally without backwards lettering.',
  },
  {
    q: 'Who owns the copyright of scripts written on ScriptFlow?',
    a: 'You retain 100% full ownership and copyright over every script, hook, and video outline you produce. We never claim any intellectual property, and your scripts are never used to train public AI models.',
  },
  {
    q: 'Does ScriptFlow work without AI?',
    a: 'Absolutely. Every core tool—the rich-text TipTap studio, the teleprompter, the speaking time calculator, the B-roll planner, and the version history—works completely offline and without AI. AI text improvements are 100% optional and surgical.',
  },
  {
    q: 'Can I use ScriptFlow on my iPad or phone on set?',
    a: 'Yes. ScriptFlow is an installable PWA (Progressive Web App). You can tap "Add to Home Screen" on iOS, iPadOS, Android, Mac, or Windows to run full-screen offline right by your camera tripod.',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useSEO({
    title: 'ScriptFlow — The Video Script Studio for YouTube & Shorts Creators',
    description: 'Stop scripting in Google Docs. ScriptFlow is the dedicated pre-production studio for video creators. Craft viral hooks, map B-roll cues, and deliver flawlessly with a built-in mirror teleprompter.',
    keywords: 'youtube script editor, teleprompter glass online, b-roll planner, scriptwriting studio, video retention hooks, ai scriptwriter, creator tools',
    schemaData: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'SoftwareApplication',
          'name': 'ScriptFlow',
          'operatingSystem': 'Web, Windows, macOS, iOS, Android',
          'applicationCategory': 'MultimediaApplication',
          'offers': {
            '@type': 'Offer',
            'price': '0',
            'priceCurrency': 'USD',
          },
          'aggregateRating': {
            '@type': 'AggregateRating',
            'ratingValue': '4.9',
            'ratingCount': '320',
          },
          'description': 'A dedicated pre-production studio for camera-facing video creators featuring hook libraries, B-roll planning, speaking time calculators, and mirror teleprompter.',
        },
        {
          '@type': 'Organization',
          'name': 'ScriptFlow',
          'url': 'https://scriptflow.app',
          'logo': 'https://scriptflow.app/logo.png',
        },
        {
          '@type': 'FAQPage',
          'mainEntity': FAQS.map(faq => ({
            '@type': 'Question',
            'name': faq.q,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': faq.a,
            }
          }))
        }
      ]
    }
  });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCTA = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-amber-100 selection:text-amber-900">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-xs'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 text-gray-900 hover:text-gray-700 transition-colors">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center shadow-xs">
              <PenLine className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">ScriptFlow</span>
            <span className="text-[10px] uppercase font-bold tracking-wider bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full border border-gray-200 hidden sm:inline-block">
              Creator Studio
            </span>
          </Link>

          {/* Quick Nav Anchors */}
          <div className="hidden md:flex items-center gap-6 text-xs font-medium text-gray-600">
            <button onClick={() => scrollToSection('hook-lab')} className="hover:text-gray-900 transition-colors">
              Hook Lab
            </button>
            <button onClick={() => scrollToSection('workflow')} className="hover:text-gray-900 transition-colors">
              Workflow
            </button>
            <button onClick={() => scrollToSection('comparison')} className="hover:text-gray-900 transition-colors">
              Vs Notion/Docs
            </button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-gray-900 transition-colors">
              Pricing
            </button>
            <Link to="/blog" className="hover:text-gray-900 transition-colors">
              Guides
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 text-xs font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-all"
              >
                Open Studio
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Log in
                </Link>
                <button
                  onClick={handleCTA}
                  className="px-4 py-2 text-xs font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 shadow-sm transition-all active:scale-95"
                >
                  Start Free
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden">
        {/* Subtle radial ambient glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-tr from-purple-100/40 via-amber-50/50 to-emerald-50/30 blur-3xl -z-10 rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center">
          {/* Niche Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-700 mb-6 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Built specifically for YouTube, Shorts & Talking-Head Creators</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-[1.08] mb-6 text-balance">
            Stop scripting in Google Docs.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500">
              Direct your videos before you hit record.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-10 text-balance font-normal">
            The dedicated pre-production studio. Craft viral hooks, map B-roll cues alongside your words, and deliver flawlessly with a built-in mirror teleprompter.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <button
              onClick={handleCTA}
              className="w-full sm:w-auto px-7 py-3.5 text-sm font-semibold text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-all duration-150 flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-98"
            >
              Start Writing — 100% Free
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollToSection('hook-lab')}
              className="w-full sm:w-auto px-6 py-3.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200/80 rounded-xl transition-all duration-150 flex items-center justify-center gap-2"
            >
              <Flame className="w-4 h-4 text-amber-500" />
              Try the Hook Lab Demo
            </button>
          </div>

          {/* Assurance micro-copy */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" /> No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" /> 100% your script copyright
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" /> Full offline mode
            </span>
          </div>

          {/* Platform Badges Row */}
          <div className="pt-12 mt-12 border-t border-gray-100 flex flex-wrap items-center justify-center gap-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mr-2">
              Engineered for:
            </span>
            {PLATFORMS.map((p) => (
              <span
                key={p.name}
                className="text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1 rounded-full"
              >
                {p.badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Hook & Retention Lab Demo */}
      <section id="hook-lab" className="py-12 px-6 bg-gradient-to-b from-white via-gray-50/50 to-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-2">
              Interactive Test Drive
            </h2>
            <p className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              Test a high-retention hook in your niche
            </p>
          </div>

          <InteractiveHookLab />
        </div>
      </section>

      {/* The 4-Step Creator Pipeline Showcase */}
      <section id="workflow" className="py-16 px-6">
        <CreatorWorkflowTabs />
      </section>

      {/* Competitor Comparison Matrix */}
      <section id="comparison" className="py-16 px-6 bg-gray-50/50">
        <CompetitorComparisonTable />
      </section>

      {/* Creator Testimonials & Results */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              Proven Results
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 mt-3 mb-4">
              Loved by creators who take retention seriously.
            </h2>
            <p className="text-base text-gray-500">
              Here is how solo creators and video storytellers use ScriptFlow to elevate their production quality.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="p-6 bg-white rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      {t.metric}
                    </span>
                    <div className="flex gap-0.5 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 font-serif leading-relaxed mb-6 italic">
                    "{t.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                  />
                  <div>
                    <div className="text-xs font-bold text-gray-900">{t.name}</div>
                    <div className="text-[11px] text-gray-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transparent Pricing Section */}
      <section id="pricing" className="py-20 px-6 bg-gray-50/70 border-y border-gray-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
              Simple, Transparent Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 mt-3 mb-4">
              Start free. Upgrade as your channel grows.
            </h2>
            <p className="text-base text-gray-500">
              No hidden paywalls on core writing features. Keep full control of your creative process.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {/* Free Tier */}
            <div className="p-8 bg-white rounded-3xl border border-gray-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Creator Free
                </div>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold text-gray-900">$0</span>
                  <span className="text-xs text-gray-400 font-medium">/ forever</span>
                </div>
                <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                  Everything you need to write professional scripts and film with the teleprompter.
                </p>
                <ul className="space-y-3 text-xs text-gray-700 mb-8">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Unlimited manual scripts & folders</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Pro Teleprompter</strong> with mirror glass flip</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Real-time WPM speaking time calculator</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>50+ Viral Hook Templates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Export to PDF, Word (.doc) & Markdown</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={handleCTA}
                className="w-full py-3 text-xs font-semibold text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
              >
                Start Writing Free
              </button>
            </div>

            {/* Pro Tier (Featured) */}
            <div className="p-8 bg-gray-900 text-white rounded-3xl shadow-xl flex flex-col justify-between relative border border-gray-800">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-gray-950 text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                Most Popular
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">
                  Creator Pro
                </div>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold text-white">$12</span>
                  <span className="text-xs text-gray-400 font-medium">/ month</span>
                </div>
                <p className="text-xs text-gray-300 mb-6 leading-relaxed">
                  For active creators publishing weekly long-form videos, podcasts, or daily shorts.
                </p>
                <ul className="space-y-3 text-xs text-gray-200 mb-8">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span><strong>Everything in Free</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span><strong>Unlimited ScriptFlow AI</strong> surgical refinements</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Speech-to-Script Voice Dictation mode</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>1-Click Repurposing (Shorts, Threads, Newsletters)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Cloud database backup & multi-device sync</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>In-browser audio recorder for line readings</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={handleCTA}
                className="w-full py-3 text-xs font-bold text-gray-900 bg-white hover:bg-gray-100 rounded-xl transition-all shadow-md active:scale-98"
              >
                Upgrade to Pro
              </button>
            </div>

            {/* Studio / Agency Tier */}
            <div className="p-8 bg-white rounded-3xl border border-gray-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Studio & Teams
                </div>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold text-gray-900">$29</span>
                  <span className="text-xs text-gray-400 font-medium">/ month</span>
                </div>
                <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                  For production companies, channels with video editors, and multi-host podcasts.
                </p>
                <ul className="space-y-3 text-xs text-gray-700 mb-8">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Everything in Creator Pro</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>NLE Markers Export (Premiere Pro & DaVinci)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Team workspace folders & line comments</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Custom Brand Voice profiles</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Dedicated priority creator support</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={handleCTA}
                className="w-full py-3 text-xs font-semibold text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
              >
                Join Studio Waitlist
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Creator FAQ Accordion */}
      <section id="faq" className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Got Questions?
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mt-3 mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-gray-500">
              Everything you need to know about our video pre-production studio.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl border border-gray-200 bg-white overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-semibold text-sm text-gray-900 hover:bg-gray-50/50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-gray-900' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3 bg-gray-50/30">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final High-Impact CTA Banner */}
      <section className="py-20 px-6 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Your next video deserves a real pre-production studio.
          </h2>
          <p className="text-base text-gray-400 max-w-xl mx-auto mb-8 leading-relaxed">
            Stop losing viewers to sloppy pacing and forgotten B-roll. Script with intention, direct your visuals, and deliver with confidence on camera.
          </p>
          <button
            onClick={handleCTA}
            className="px-8 py-4 text-sm font-bold text-gray-900 bg-white rounded-xl hover:bg-gray-100 transition-all duration-150 flex items-center gap-2 mx-auto shadow-lg active:scale-98"
          >
            Start Writing in ScriptFlow — It's Free
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Comprehensive Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5 text-gray-900 font-bold text-lg">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <PenLine className="w-4 h-4 text-white" />
              </div>
              <span>ScriptFlow</span>
            </div>
            <p className="text-xs text-gray-500 max-w-sm leading-relaxed">
              The professional video pre-production studio for YouTube creators, podcasters, and camera-facing storytellers. Write naturally, map your visuals, and film with confidence.
            </p>
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} ScriptFlow Inc. All rights reserved.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2.5 text-xs text-gray-600">
              <li><button onClick={handleCTA} className="hover:text-gray-900 text-left">AV Scripting Studio</button></li>
              <li><button onClick={handleCTA} className="hover:text-gray-900 text-left">Speech-to-Script Voice Mode</button></li>
              <li><button onClick={handleCTA} className="hover:text-gray-900 text-left">Hardware Mirror Teleprompter</button></li>
              <li><button onClick={handleCTA} className="hover:text-gray-900 text-left">60+ Hook Formula Library</button></li>
              <li><button onClick={handleCTA} className="hover:text-gray-900 text-left">Script Pacing Analyzer</button></li>
            </ul>
          </div>

          {/* Resources & Content */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">Resources</h4>
            <ul className="space-y-2.5 text-xs text-gray-600">
              <li><Link to="/blog" className="hover:text-gray-900">Creator Publication</Link></li>
              <li><Link to="/blog/3-second-hook-formula-youtube-shorts" className="hover:text-gray-900">3-Second Hook Formula</Link></li>
              <li><Link to="/blog/structure-10-minute-video-high-retention" className="hover:text-gray-900">10-Minute Video Retention</Link></li>
              <li><Link to="/blog/ai-scriptwriting-without-losing-your-voice" className="hover:text-gray-900">Human-First AI Scripting</Link></li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">Company & Legal</h4>
            <ul className="space-y-2.5 text-xs text-gray-600">
              <li><Link to="/about" className="hover:text-gray-900">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-gray-900">Contact & Support</Link></li>
              <li><Link to="/privacy" className="hover:text-gray-900">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-gray-900">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
