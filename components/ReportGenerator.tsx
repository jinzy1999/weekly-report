'use client';

import { useState, useCallback, useRef } from 'react';
import { Copy, Check, Sparkles, Trash2, ChevronDown } from 'lucide-react';
import {
  generateReport,
  formatReport,
  type Tone,
} from '@/lib/templates';

const tones: { value: Tone; label: string; desc: string }[] = [
  { value: 'formal', label: '专业正式', desc: '适合传统企业，措辞严谨规范' },
  { value: 'concise', label: '简洁高效', desc: '适合快节奏团队，直击重点' },
  { value: 'tech', label: '技术极客', desc: '适合互联网/技术团队' },
];

export default function ReportGenerator() {
  const [input, setInput] = useState('');
  const [tone, setTone] = useState<Tone>('formal');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [generated, setGenerated] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  const handleGenerate = useCallback(() => {
    if (!input.trim()) return;
    const report = generateReport(input, tone);
    const formatted = formatReport(report, tone);
    setOutput(formatted);
    setGenerated(true);
  }, [input, tone]);

  const handleCopy = useCallback(async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = output;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [output]);

  const handleClear = useCallback(() => {
    setInput('');
    setOutput('');
    setGenerated(false);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        handleGenerate();
      }
    },
    [handleGenerate]
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="text-center pt-12 pb-6 px-4">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          周报生成器
        </h1>
        <p className="text-lg text-gray-500 max-w-md mx-auto">
          输入本周工作要点，一键生成让老板满意的专业周报
        </p>
      </header>

      <main className="max-w-2xl mx-auto px-4 pb-12">
        {/* Input Card */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-gray-700">
              输入工作要点
            </label>
            <span className="text-xs text-gray-400">
              每行一个要点，Ctrl+Enter 生成
            </span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`示例：
完成用户登录模块开发
修复首页加载慢的问题
下周计划优化数据库查询
参与产品需求评审会议
输出技术方案设计文档`}
            rows={8}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                       resize-none transition placeholder:text-gray-400"
          />

          {/* Tone Selector */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-gray-500 mr-1">风格：</span>
            {tones.map((t) => (
              <button
                key={t.value}
                onClick={() => setTone(t.value)}
                className={`relative px-3 py-1.5 rounded-full text-xs font-medium transition-all
                  ${
                    tone === t.value
                      ? 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                title={t.desc}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleGenerate}
              disabled={!input.trim()}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl
                         font-medium text-sm hover:bg-indigo-700 active:scale-[0.98]
                         disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Sparkles size={16} />
              生成周报
            </button>
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 px-4 py-2.5 text-gray-500 hover:text-gray-700
                         rounded-xl font-medium text-sm hover:bg-gray-100 transition-all"
            >
              <Trash2 size={16} />
              清空
            </button>
          </div>
        </div>

        {/* Output Card */}
        {generated && (
          <div
            ref={outputRef}
            className="bg-white rounded-2xl shadow-sm border p-6 animate-in fade-in slide-in-from-top-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-700">
                生成的周报
              </h2>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                           transition-all ${
                             copied
                               ? 'bg-green-100 text-green-700'
                               : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                           }`}
              >
                {copied ? (
                  <>
                    <Check size={14} />
                    已复制
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    一键复制
                  </>
                )}
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans leading-relaxed bg-gray-50 rounded-xl p-4 border border-gray-100">
              {output}
            </pre>
          </div>
        )}

        {/* Donation Section */}
        <div className="mt-8 text-center">
          <div className="inline-block bg-white rounded-2xl shadow-sm border p-6 max-w-sm">
            <p className="text-sm text-gray-500 mb-3">
              如果这个工具帮到了你，请作者喝杯奶茶吧 ☕️
            </p>
            <div className="w-48 h-48 mx-auto bg-gray-100 rounded-xl flex items-center justify-center">
              <p className="text-sm text-gray-400">
                微信收款码
                <br />
                <span className="text-xs">（请替换为你的收款码截图）</span>
              </p>
            </div>
            <p className="text-xs text-gray-400 mt-3">¥10 支持创作</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-xs text-gray-400">
        完全免费 · 无需登录 · 数据不上传 · 纯浏览器端运行
      </footer>
    </div>
  );
}
