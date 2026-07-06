import { useState, useMemo, useCallback } from 'react';

interface DiffResult {
  added?: boolean;
  removed?: boolean;
  value: string;
}

function diffChars(a: string, b: string): DiffResult[] {
  const result: DiffResult[] = [];
  const aLen = a.length;
  const bLen = b.length;
  const dp: number[][] = Array(aLen + 1).fill(null).map(() => Array(bLen + 1).fill(0));

  for (let i = 1; i <= aLen; i++) {
    for (let j = 1; j <= bLen; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  let i = aLen;
  let j = bLen;
  const tempResult: DiffResult[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      tempResult.push({ value: a[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      tempResult.push({ value: b[j - 1], added: true });
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      tempResult.push({ value: a[i - 1], removed: true });
      i--;
    }
  }

  return tempResult.reverse();
}

const normalizeText = (text: string): string => {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/^>\s*/gm, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`{1,3}/g, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\|\s*[-:]+\s*\|/g, '')
    .replace(/\|/g, ' ')
    .replace(/\^\[\d+\]/g, '')
    .replace(/[-=*]{3,}/g, '')
    .replace(/[~\\]/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^\n+/, '')
    .replace(/\n+$/, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/ \n/g, '\n');
};

export default function TextDiff() {
  const [originalText, setOriginalText] = useState('');
  const [modifiedText, setModifiedText] = useState('');

  const normalizedOriginal = useMemo(() => normalizeText(originalText), [originalText]);
  const normalizedModified = useMemo(() => normalizeText(modifiedText), [modifiedText]);

  const diffResult = useMemo(() => {
    if (!normalizedOriginal || !normalizedModified) return [];
    try {
      return diffChars(normalizedOriginal, normalizedModified);
    } catch {
      return [];
    }
  }, [normalizedOriginal, normalizedModified]);

  const handleClear = useCallback(() => {
    setOriginalText('');
    setModifiedText('');
  }, []);

  const handleSwap = useCallback(() => {
    setOriginalText(prev => modifiedText);
    setModifiedText(prev => originalText);
  }, [originalText, modifiedText]);

  const handleNormalize = useCallback(() => {
    setOriginalText(normalizedOriginal);
    setModifiedText(normalizedModified);
  }, [normalizedOriginal, normalizedModified]);

  const handleOriginalChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOriginalText(e.target.value);
  }, []);

  const handleModifiedChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setModifiedText(e.target.value);
  }, []);

  const renderDiff = (diff: DiffResult[]) => {
    return diff.map((part, index) => {
      if (part.added) {
        return (
          <span
            key={index}
            style={{ backgroundColor: '#F1F6F2', color: '#3A6B42', borderRadius: '3px', padding: '0 2px' }}
            title="新增内容"
          >
            {part.value}
          </span>
        );
      }
      if (part.removed) {
        return (
          <span
            key={index}
            style={{ backgroundColor: '#FDF2F1', color: '#A8403A', borderRadius: '3px', padding: '0 2px', textDecoration: 'line-through' }}
            title="删除内容"
          >
            {part.value}
          </span>
        );
      }
      return <span key={index}>{part.value}</span>;
    });
  };

  const changesCount = useMemo(() => {
    return diffResult.filter(d => d.added || d.removed).length;
  }, [diffResult]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            文本差异比较工具
          </h1>
          <p className="text-slate-500">
            输入原文和修改后的文本，自动识别差异并高亮标注
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                原文
              </label>
              <span className="text-sm text-slate-400">
                {originalText.length} 字符
              </span>
            </div>
            <textarea
              value={originalText}
              onChange={handleOriginalChange}
              placeholder="在此输入原始文本..."
              className="w-full h-64 p-4 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-700 placeholder:text-slate-400"
            />
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                修改后
              </label>
              <span className="text-sm text-slate-400">
                {modifiedText.length} 字符
              </span>
            </div>
            <textarea
              value={modifiedText}
              onChange={handleModifiedChange}
              placeholder="在此输入修改后的文本..."
              className="w-full h-64 p-4 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-slate-700 placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={handleNormalize}
            className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            ✨ 格式化文本
          </button>
          <button
            onClick={handleSwap}
            className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium flex items-center gap-2"
          >
            ↔️ 交换文本
          </button>
          <button
            onClick={handleClear}
            className="px-6 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium flex items-center gap-2"
          >
            🗑️ 清空内容
          </button>
        </div>

        {originalText && modifiedText && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-700 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                差异对比结果
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded" style={{ backgroundColor: '#FDF2F1' }}></span>
                  <span className="text-sm text-slate-500">删除</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded" style={{ backgroundColor: '#F1F6F2' }}></span>
                  <span className="text-sm text-slate-500">新增</span>
                </div>
                {changesCount > 0 && (
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm font-medium">
                    {changesCount} 处变更
                  </span>
                )}
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg min-h-[120px] whitespace-pre-wrap break-all text-slate-700 leading-relaxed">
              {renderDiff(diffResult)}
            </div>
            {changesCount === 0 && (
              <div className="text-center text-green-600 py-4">
                ✅ 两段文本完全一致，没有差异
              </div>
            )}
          </div>
        )}

        {!originalText || !modifiedText ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-slate-600 mb-2">
              请输入文本进行比较
            </h3>
            <p className="text-slate-400">
              在上方两个输入框中分别输入原文和修改后的文本，系统会自动显示差异
            </p>
          </div>
        ) : null}

        <div className="mt-8 text-center text-slate-400 text-sm">
          支持实时比较 • 字符级差异检测 • 无需上传服务器
        </div>
      </div>
    </div>
  );
}