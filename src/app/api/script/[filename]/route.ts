import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  const { searchParams } = new URL(request.url);
  const script = searchParams.get('content');

  if (!script) {
    return new NextResponse('Script content missing', { status: 400 });
  }

  // Decode the base64 encoded script
  const decodedScript = Buffer.from(script, 'base64').toString('utf-8');

  // Return with proper content type for userscripts
  return new NextResponse(decodedScript, {
    headers: {
      'Content-Type': 'text/javascript; charset=utf-8',
      'Content-Disposition': `inline; filename="${filename}"`,
    },
  });
}
