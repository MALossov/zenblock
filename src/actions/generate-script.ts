'use server';

import { revalidatePath } from 'next/cache';

export async function generateScript(domain: string, locale: string = 'zh', baseUrl: string = 'http://localhost:3000') {
  // Clean domain input
  const cleanDomain = domain.trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
  
  const script = `// ==UserScript==
// @name         ZenBlock Enforcer - ${cleanDomain}
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Block ${cleanDomain} and redirect to ZenBlock intercept page
// @author       ZenBlock
// @match        *://*.${cleanDomain}/*
// @match        *://${cleanDomain}/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    // 立即终止当前页面加载
    if (window.stop) {
        window.stop();
    } else {
        document.execCommand('Stop');
    }
    
    // 强制跳转至反思页面
    const target = '${baseUrl}/${locale}/intercept';
    const current = window.location.host;
    window.location.href = target + '?source=' + encodeURIComponent(current);
})();`;

  return script;
}