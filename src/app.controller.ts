import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import * as path from 'path';
import { VideoService } from './video/video.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private videoService: VideoService,
  ) {}

  @Get()
  async getPlayerPage(@Res() res: Response) {
    await this.videoService.streamVideo();
    const filePath = path.resolve(process.cwd(), 'public', 'index.html');
    res.sendFile(filePath);
  }
}
