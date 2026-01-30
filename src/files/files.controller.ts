import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  Param,
  Res,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileValidation } from './helpers/fileValidation.helper';
import { diskStorage } from 'multer';
import { fileNamer } from './helpers/fileNamer.helper';
import type { Response } from 'express';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileValidation,
      storage: diskStorage({
        destination: './static/products',
        filename: fileNamer,
      }),
    }),
  )
  uploadFile(@UploadedFile(ParseFilePipe) file: Express.Multer.File) {
    return this.filesService.uploadFile(file);
  }

  @Get('product/:imageName')
  getOneImage(@Res() res: Response, @Param('imageName') imageName: string) {
    const imagePath = this.filesService.getImage(imageName);

    res.status(200).sendFile(imagePath);
  }
}
