import { NextRequest, NextResponse } from 'next/server';
import { generateScript } from '@/actions/generate-script';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  const { searchParams } = new URL(request.url);
  
  // Get parameters from URL
  const domain = searchParams.get('domain');
  const locale = searchParams.get('locale') || 'zh';
  const baseUrl = searchParams.get('baseUrl') || 'http://localhost:3000';

  if (!domain) {
    return new NextResponse('Domain parameter missing', { status: 400 });
  }

  // Generate script directly on server side - no encoding issues
  const script = await generateScript(domain, locale, baseUrl);

  // Return with proper content type for userscripts
  return new NextResponse(script, {
    headers: {
      'Content-Type': 'text/javascript; charset=utf-8',
      'Content-Disposition': `inline; filename="${filename}"`,
      'Cache-Control': 'no-cache',
    },
  });
}
