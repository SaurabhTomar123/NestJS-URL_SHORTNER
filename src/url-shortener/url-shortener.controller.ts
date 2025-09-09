import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { UrlShortenerService } from './url-shortener.service';
import { UrlShortenerDto } from './dto';
import { Response } from 'express';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@Controller()
export class UrlShortenerController {
  constructor(private urlShortenerService: UrlShortenerService) {}

  // Public: anyone can create a short URL now
  @Post('short-url')
  shortUrl(@Body() dto: UrlShortenerDto) {
    return this.urlShortenerService.shortUrlService(dto);
  }

  // Public: redirect works without user context
  @Get(':shortid')
  async redirectToId(
    @Param('shortid') shortId: string,
    @Res() res: Response,
    @Headers('user-agent') deviceType: string,
  ) {
    const redirectUrl = await this.urlShortenerService.redirectUrlService(
      shortId,
      deviceType,
    );

    if (!redirectUrl) {
      throw new BadRequestException('No data found');
    }

    res.redirect(redirectUrl.url);
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(10)
  @Get('analytics/:shortId')
  async urlAnalyticsHandler(@Param('shortId') shortId: string) {
    return this.urlShortenerService.getUrlAnalytics(shortId);
  }
}
