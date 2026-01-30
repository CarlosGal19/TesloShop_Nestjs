import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { responseConfig } from '../common/global/response.config';
import { isUUID } from 'class-validator';
import { join } from 'path';
import { existsSync } from 'fs';

@Injectable()
export class FilesService {
  public uploadFile(file: Express.Multer.File) {
    return responseConfig(
      { file: file.filename },
      'Image was saved successfully',
    );
  }

  getImage(imageName: string) {
    const imageUUID = imageName.split('.')[0];
    if (!isUUID(imageUUID)) {
      throw new BadRequestException('Invalid image name');
    }

    const path = join(__dirname, '../../static/products/', imageName);

    if (!existsSync(path)) {
      throw new NotFoundException('Image not found');
    }

    return path;
  }
}
