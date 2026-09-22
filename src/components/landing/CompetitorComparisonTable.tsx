import React from 'react';
import { Check, X, Minus, Sparkles } from 'lucide-react';

interface ComparisonRow {
  feature: string;
  category: string;
  scriptflow: boolean | string;
  googleDocs: boolean | string;
  notion: boolean | string;
  genericAi: boolean | string;
  descript: boolean | string;
}

const COMPARISON_DATA: ComparisonRow[] = [
  {
    feature: 'Real-Time WPM Speaking Time Calculator',
    category: 'Video Pacing',
    scriptflow: true,
    googleDocs: false,
    notion: false,
    genericAi: false,
    descript: 'Partial (post-recording)',
  },
  {
    feature: 'Studio Glass Teleprompter (Horizontal & Vertical Mirroring)',
    category: 'Recording',
    scriptflow: true,
    googleDocs: false,
    notion: false,
    genericAi: false,
    descript: 'Basic (No glass flip)',
  },
  {
    feature: 'Dual-Column B-Roll & Visual Cue Planner',
    category: 'Directing',
    scriptflow: true,
    googleDocs: 'Manual table only',
    notion: 'Manual database only',
    genericAi: false,
    descript: 'Timeline only',
  },
  {
    feature: '60+ Proven Viral Hook Formulas with Retention Scores',
    category: 'Ideation',
    scriptflow: true,
    googleDocs: false,
    notion: false,
    genericAi: 'Generic chatbot output',
    descript: false,
  },
  {
    feature: 'Surgical Non-Destructive AI (Preserves Personal Voice)',
    category: 'AI Quality',
    scriptflow: true,
    googleDocs: false,
    notion: 'Paid add-on ($10/mo)',
    genericAi: 'Replaces entire text',
    descript: 'Transcription only',
  },
  {
    feature: '1-Click Repurposing (Shorts, Threads, Newsletters)',
    category: 'Distribution',
    scriptflow: true,
    googleDocs: false,
    notion: false,
    genericAi: 'Requires prompt engineering',
    descript: 'Clip generator only',
  },
  {
    feature: '100% Creator IP Ownership & Zero AI Training',
    category: 'Privacy',
    scriptflow: true,
    googleDocs: true,
    notion: true,
    genericAi: 'Depends on tier',
    descript: true,
  },
  {
    feature: 'Lightweight Browser Studio & Offline PWA',
    category: 'Performance',
    scriptflow: 'Instant (<1s load)',
    googleDocs: 'Browser only',
    notion: 'Sluggish on large docs',
    genericAi: 'Browser only',
    descript: 'Heavy 4GB Desktop App',
  },
];

export const CompetitorComparisonTable: React.FC = () => {
  const renderCell = (val: boolean | string, isScriptFlow = false) => {
    if (val === true) {
      return (
        <div className="flex items-center justify-center">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
            isScriptFlow ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}>
            <Check className="w-3.5 h-3.5" />
          </div>
        </div>
      );
    }
    if (val === false) {
      return (
        <div className="flex items-center justify-center text-gray-300">
          <X className="w-4 h-4" />
        </div>
      );
    }
    return (
      <div className={`text-[11px] text-center px-1 font-medium ${
        isScriptFlow ? 'text-emerald-700 font-bold' : 'text-gray-500'
      }`}>
        {val}
      </div>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-20 px-4">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          Why Creators Switch
        </span>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 mt-3 mb-3">
          ScriptFlow vs. The Fragmented Stack
        </h2>
        <p className="text-sm sm:text-base text-gray-500">
          Stop juggling 4 tabs, a teleprompter app on your phone, and a separate ChatGPT prompt window.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-lg overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/70">
              <th className="py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-2/5">
                Feature / Capability
              </th>
              <th className="py-4 px-3 text-center w-1/5 bg-gray-900 text-white rounded-t-xl">
                <div className="flex items-center justify-center gap-1.5 font-bold text-sm">
                  <span>ScriptFlow</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </div>
                <div className="text-[10px] text-gray-300 font-normal mt-0.5">The Video Studio</div>
              </th>
              <th className="py-4 px-3 text-center text-xs font-medium text-gray-600 w-[15%]">
                Google Docs / Word
              </th>
              <th className="py-4 px-3 text-center text-xs font-medium text-gray-600 w-[15%]">
                Notion
              </th>
              <th className="py-4 px-3 text-center text-xs font-medium text-gray-600 w-[15%]">
                Descript
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs">
            {COMPARISON_DATA.map((row) => (
              <tr key={row.feature} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-3.5 px-5 font-medium text-gray-800">
                  <div>{row.feature}</div>
                  <span className="text-[10px] text-gray-400 font-normal uppercase">{row.category}</span>
                </td>
                <td className="py-3.5 px-3 bg-emerald-50/30 border-x border-emerald-100/50">
                  {renderCell(row.scriptflow, true)}
                </td>
                <td className="py-3.5 px-3">
                  {renderCell(row.googleDocs)}
                </td>
                <td className="py-3.5 px-3">
                  {renderCell(row.notion)}
                </td>
                <td className="py-3.5 px-3">
                  {renderCell(row.descript)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
