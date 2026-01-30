import { Injectable } from '@nestjs/common';
import { responseConfig } from '../common/global/response.config';

@Injectable()
export class FilesService {
  public uploadFile(file: Express.Multer.File) {
    return responseConfig(
      { file: file.filename },
      'Image was saved successfully',
    );
  }
}
