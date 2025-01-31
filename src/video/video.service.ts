import { Injectable } from '@nestjs/common';
import * as ffmpeg from 'fluent-ffmpeg';
import * as path from 'path';
import * as fs from 'fs/promises';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VideoService {
  private readonly configService: ConfigService;
  constructor(configService: ConfigService) {
    this.configService = configService;
  }

  private async directoryExists(directory: string): Promise<void> {
    try {
      fs.mkdir(directory, { recursive: true });
    } catch (error) {
      throw new Error(`Failed to create directory: ${error.message}`);
    }
  }

  private async generateHlsStream(
    videoPath: string,
    outputDir: string,
  ): Promise<string> {
    const m3u8Path = `${outputDir}/output.m3u8`;
    return new Promise((resolve, reject) => {
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
        .on('end', resolve)
        .on('error', reject)
        .run();
    });
  }

  async streamVideo(): Promise<boolean> {
    try {
      ffmpeg.setFfmpegPath(this.configService.get('FFMPEG_PATH'));
      const videoPath = path.resolve(
        process.cwd(),
        'public',
        'videos',
        `video.mp4`,
      );
      const outputDir = path.resolve(process.cwd(), 'public', 'videos');

      await this.directoryExists(outputDir);
      await this.generateHlsStream(videoPath, outputDir);

      return true;
    } catch (error) {
      throw new Error(`Failed to create stream: ${error}`);
    }
  }
}
