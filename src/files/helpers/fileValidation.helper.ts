import { Request } from 'express';

export const fileValidation = (
  req: Request,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file) return cb(new Error('File is empty'), false);

  const fileExtension = file.mimetype.split('/')[1];
  const validExtensions = [
    'png',
    'jpeg',
    'jpg',
    'webp',
    'gif',
    'bmp',
    'svg+xml',
    'tiff',
    'avif',
    'heic',
    'heif',
  ];

  if (!validExtensions.includes(fileExtension)) {
    return cb(
      new Error('File format is not valid. Make sure file is an image'),
      false,
    );
  }

  cb(null, true);
};
