export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  if (!file)
    return callback(new Error('No se ha subido ningún archivo'), false);

  const fileExtension = file.mimetype.split('/')[1];
  const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];

  if (validExtensions.includes(fileExtension)) return callback(null, true);

  callback(null, false);
};
