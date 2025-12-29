import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source');
    const format = searchParams.get('format') || 'csv';

    // 获取破戒日志
    const logs = await prisma.relapseLog.findMany({
      where: source && source !== 'all' ? { source } : undefined,
      orderBy: { timestamp: 'desc' }
    });

    if (format === 'csv') {
      // 生成 CSV
      const csvHeader = 'Date,Time,Source,Locale\n';
      const csvRows = logs.map(log => {
        const date = new Date(log.timestamp);
        return `${date.toLocaleDateString()},${date.toLocaleTimeString()},${log.source},${log.locale}`;
      }).join('\n');
      
      const csv = csvHeader + csvRows;
      
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="zenblock-data-${source || 'all'}-${new Date().toISOString().split('T')[0]}.csv"`
        }
      });
    } else if (format === 'json') {
      // 返回 JSON 格式
      return NextResponse.json({
        exportDate: new Date().toISOString(),
        source: source || 'all',
        totalRecords: logs.length,
        data: logs
      });
    }

    return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
  } catch (error) {
    console.error('Error exporting data:', error);
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}
