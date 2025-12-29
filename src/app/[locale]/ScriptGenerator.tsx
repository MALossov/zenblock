'use client';

import { useState, useTransition } from 'react';
import { generateScript as generateScriptAction } from '@/actions/generate-script';
import { Zap, Check } from 'lucide-react';

interface Translations {
  placeholder: string;
  generate: string;
  generating: string;
  scriptTitle: string;
  scriptDesc: string;
  copyToClipboard: string;
  installScript: string;
  copied?: string;
  copyFailed?: string;
}

export default function ScriptGenerator({ 
  translations, 
  locale,
  onScriptGenerated
}: { 
  translations: Translations;
  locale: string;
  onScriptGenerated?: (hasScript: boolean) => void;
}) {
  const [domain, setDomain] = useState('');
  const [isPending, startTransition] = useTransition();
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!domain.trim()) return;
    
    startTransition(async () => {
      // Clear any existing generated script before generating new one
      setGeneratedScript(null);
      setCopyStatus('idle');
      onScriptGenerated?.(false);
      
      // Get current base URL or use localhost as default
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
      const script = await generateScriptAction(domain, locale, baseUrl);
      setGeneratedScript(script);
      onScriptGenerated?.(true);
    });
  };

  const handleCopy = async () => {
    if (generatedScript) {
      try {
        await navigator.clipboard.writeText(generatedScript);
        setCopyStatus('success');
        setTimeout(() => setCopyStatus('idle'), 2000);
      } catch (error) {
        setCopyStatus('error');
        setTimeout(() => setCopyStatus('idle'), 2000);
      }
    }
  };

  const handleInstall = () => {
    if (domain) {
      const cleanDomain = domain.trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
      
      // Navigate directly to API endpoint - no encoding needed
      // Script Cat will intercept .user.js URLs
      const scriptUrl = `/api/script/${cleanDomain}.user.js?domain=${encodeURIComponent(cleanDomain)}&locale=${locale}&baseUrl=${encodeURIComponent(baseUrl)}`;
      window.location.href = scriptUrl;
    }
  };

  return (
    <div className={`space-y-4 transition-all duration-300 ${generatedScript ? 'w-full' : ''}`}>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="domain" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {translations.placeholder}
          </label>
          <input
            type="text"
            id="domain"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="example.com"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isPending}
          className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isPending ? translations.generating : translations.generate}
        </button>
      </form>

      {generatedScript && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">{translations.scriptTitle}</h3>
          <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg text-xs font-mono max-h-96 overflow-y-auto text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
            {generatedScript}
          </pre>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{translations.scriptDesc}</p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleCopy}
              className={`flex-1 px-4 py-2 text-sm font-medium border rounded-lg transition-colors flex items-center justify-center gap-2 ${
                copyStatus === 'success' 
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-600 dark:border-green-400'
                  : copyStatus === 'error'
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-600 dark:border-red-400'
                  : 'text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
              }`}
            >
              {copyStatus === 'success' && <Check className="w-4 h-4" />}
              {copyStatus === 'success' ? (translations.copied || '已复制') : 
               copyStatus === 'error' ? (translations.copyFailed || '复制失败') :
               translations.copyToClipboard}
            </button>
            <button
              onClick={handleInstall}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              {translations.installScript}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}