import { Injectable } from '@nestjs/common';
import { ShortUrl } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { UrlShortenerDto } from './dto';

import ShortUniqueId from 'short-unique-id';
import { URL_ACTIVE_TIME } from '../config/appConstants.json';

@Injectable()
export class UrlShortenerService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  // Public: anyone can shorten a URL now
  async shortUrlService(dto: UrlShortenerDto) {
    const { randomUUID } = new ShortUniqueId({ length: 8 });
   const shortId: ShortUrl = await this.prisma.shortUrl.create({
  data: {
    shortId: randomUUID(),
    redirectUrl: dto.url,
     userId: null, 
  },
});
    const shortUrl = this.config.get('BASE_URL') + shortId.shortId;

    return { shortId: shortId.shortId, shortUrl: shortUrl };
  }

  async redirectUrlService(shortId: string, deviceType: string) {
    try {
      const redirectUrl = await this.prisma.shortUrl.findFirst({
        where: { shortId },
        select: {
          id: true,
          redirectUrl: true,
          clickCount: true,
        },
      });

      if (!redirectUrl) {
        return false;
      }

      await Promise.all([
        this.prisma.shortUrl.update({
          where: {
            id: redirectUrl.id,
            shortId,
          },
          data: {
            clickCount: redirectUrl.clickCount + 1,
          },
        }),
        this.prisma.clickAnalytics.create({
          data: {
            deviceType: deviceType,
            shortUrlId: redirectUrl.id,
          },
        }),
      ]);

      return { url: redirectUrl.redirectUrl };
    } catch (error) {
      throw `Error in redirectUrlService:${error}`;
    }
  }

  async deleteExpiredUrls(): Promise<void> {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(
      twentyFourHoursAgo.getHours() - URL_ACTIVE_TIME,
    );

    const inactiveShortUrl = await this.prisma.shortUrl.findMany({
      where: {
        isActive: false,
        createdAt: { lt: twentyFourHoursAgo },
      },
    });

    await Promise.all(
      inactiveShortUrl.map(async (url) => {
        await this.prisma.shortUrl.delete({
          where: { id: url.id, shortId: url.shortId },
        });
      }),
    );
  }

  async getUrlAnalytics(shortId: string) {
    try {
      let urlAnalytics = await this.prisma.shortUrl.findFirst({
        where: { shortId },
        select: {
          clickCount: true,
          clickAnalytics: {
            select: {
              id: true,
              createdAt: true,
              deviceType: true,
            },
          },
        },
      });

      const { mostActiveHours, hourlyClickCounts } =
        this.getMostActiveHours(urlAnalytics.clickAnalytics);

      urlAnalytics['mostActiveHours'] = mostActiveHours;
      urlAnalytics['hourlyClickCounts'] = hourlyClickCounts;

      return urlAnalytics;
    } catch (error) {
      throw `Error in getUrlAnalytics: ${error}`;
    }
  }

  getMostActiveHours(clicks) {
    const hourCounts: Record<number, number> = {};

    // Count the clicks for each hour
    clicks.forEach((click) => {
      const hour = new Date(click.createdAt).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    // Find the hour(s) with the maximum clicks
    const maxClicks = Math.max(...Object.values(hourCounts));
    const mostActiveHours = Object.keys(hourCounts).filter(
      (hour) => hourCounts[hour] === maxClicks,
    );

    return { mostActiveHours, hourlyClickCounts: hourCounts };
  }
}
