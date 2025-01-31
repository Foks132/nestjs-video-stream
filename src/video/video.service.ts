import { Injectable } from '@nestjs/common';
import * as ffmpeg from 'fluent-ffmpeg';
import * as path from 'path';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VideoService {
  async streamVideo() {
    const configService = new ConfigService();
    ffmpeg.setFfmpegPath(configService.get('FFMPEG_PATH'));
    const videoPath = path.resolve(
      process.cwd(),
      'public',
      'videos',
      'video.mp4',
    );
    const outputDir = path.resolve(process.cwd(), 'public', 'videos');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    const m3u8Path = `${outputDir}/output.m3u8`;
    ffmpeg(videoPath)
      .format('hls')
      .outputOptions([
        '-hls_time 5',
        '-hls_list_size 0',
        '-hls_segment_filename',
        `${outputDir}/output%d.ts`,
        '-hls_allow_cache 0',
      ])
      .output(m3u8Path)
      .run();
  }
}
