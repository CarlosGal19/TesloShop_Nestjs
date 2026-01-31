import {
  // BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { responseConfig } from '../common/global/response.config';
// import { isUUID } from 'class-validator';
import { join } from 'path';
import { existsSync } from 'fs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FilesService {
  constructor(private readonly configService: ConfigService) {}
  public uploadFile(file: Express.Multer.File) {
    const imageUrl = `${this.configService.getOrThrow('host_url')}/files/product/${file.filename}`;
    return responseConfig({ file: imageUrl }, 'Image was saved successfully');
  }

  getImage(imageName: string) {
    // const imageUUID = imageName.split('.')[0];
    // if (!isUUID(imageUUID)) {
    //   throw new BadRequestException('Invalid image name');
    // }

    const path = join(__dirname, '../../static/products/', imageName);

    if (!existsSync(path)) {
      throw new NotFoundException('Image not found');
    }

    return path;
  }
}
