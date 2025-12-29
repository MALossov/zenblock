'use client';

import { useState, ReactNode } from 'react';
import ScriptGenerator from './ScriptGenerator';

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

export default function ScriptGeneratorWrapper({ 
  translations, 
  locale,
  children 
}: { 
  translations: Translations;
  locale: string;
  children: ReactNode;
}) {
  const [hasScript, setHasScript] = useState(false);

  return (
    <div className={`w-full bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 space-y-6 transition-all duration-300 ${
      hasScript ? 'max-w-4xl' : 'max-w-md'
    }`}>
      {children}
      <ScriptGenerator 
        translations={translations} 
        locale={locale}
        onScriptGenerated={(generated) => setHasScript(generated)}
      />
    </div>
  );
}
