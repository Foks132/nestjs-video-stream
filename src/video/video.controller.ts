import { Controller, Get, Param, Res } from '@nestjs/common';
import { VideoService } from './video.service';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}
  private readonly videosPath = path.resolve(process.cwd(), 'public', 'videos');

  @Get(':filename')
  getVideo(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = path.join(this.videosPath, filename);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).send('File not found');
    }
  }
}
