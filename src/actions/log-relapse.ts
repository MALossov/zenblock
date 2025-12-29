'use server';

import { prisma } from '@/lib/db';

export async function logRelapse(source: string, locale: string = 'zh') {
  try {
    const relapseLog = await prisma.relapseLog.create({
      data: {
        source,
        locale
      }
    });

    // Return the updated count for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const count = await prisma.relapseLog.count({
      where: {
        timestamp: {
          gte: today,
        },
        source: source
      }
    });

    return { relapseLog, count };
  } catch (error) {
    console.error('Error logging relapse:', error);
    throw error;
  }
}