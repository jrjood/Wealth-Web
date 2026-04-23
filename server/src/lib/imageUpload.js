import fs from 'fs';
import { promises as fsPromises } from 'fs';
import multer from 'multer';
import path from 'path';

const allowedImageMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
]);

const allowedImageExtensions = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.gif',
  '.avif',
]);

const allowedVideoMimeTypes = new Set([
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime',
]);

const allowedVideoExtensions = new Set(['.mp4', '.webm', '.ogg', '.mov']);

const createUpload = ({
  subdirectory,
  allowedMimeTypes,
  allowedExtensions,
  fileSize,
  errorMessage,
}) => {
  const uploadRoot = path.resolve(process.cwd(), 'uploads', subdirectory);

  fs.mkdirSync(uploadRoot, { recursive: true });

  const storage = multer.diskStorage({
    destination: (_req, _file, callback) => {
      callback(null, uploadRoot);
    },
    filename: (_req, file, callback) => {
      const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname).toLowerCase()}`;
      callback(null, safeName);
    },
  });

  const upload = multer({
    storage,
    limits: { fileSize },
    fileFilter: (_req, file, callback) => {
      const extension = path.extname(file.originalname).toLowerCase();
      const mimeAllowed = allowedMimeTypes.has(file.mimetype);
      const extensionAllowed = allowedExtensions.has(extension);

      if (!mimeAllowed && !extensionAllowed) {
        callback(new Error(errorMessage));
        return;
      }

      callback(null, true);
    },
  });

  return { upload, uploadRoot };
};

export const createImageUpload = (subdirectory) =>
  createUpload({
    subdirectory,
    allowedMimeTypes: allowedImageMimeTypes,
    allowedExtensions: allowedImageExtensions,
    fileSize: 10 * 1024 * 1024,
    errorMessage: 'Only JPG, PNG, WEBP, GIF, and AVIF images are allowed',
  });

export const createProjectMediaUpload = (subdirectory) =>
  createUpload({
    subdirectory,
    allowedMimeTypes: new Set([
      ...allowedImageMimeTypes,
      ...allowedVideoMimeTypes,
    ]),
    allowedExtensions: new Set([
      ...allowedImageExtensions,
      ...allowedVideoExtensions,
    ]),
    fileSize: 100 * 1024 * 1024,
    errorMessage:
      'Only JPG, PNG, WEBP, GIF, AVIF, MP4, WEBM, OGG, and MOV files are allowed',
  });

export const toPublicUploadUrl = (subdirectory, fileName) =>
  path.posix.join('/uploads', subdirectory, fileName);

export const deleteUploadedImage = async (imageUrl) => {
  if (typeof imageUrl !== 'string' || !imageUrl.startsWith('/uploads/')) {
    return;
  }

  const filePath = path.resolve(process.cwd(), imageUrl.replace(/^\//, ''));

  try {
    await fsPromises.unlink(filePath);
  } catch (error) {
    if (error?.code !== 'ENOENT') {
      throw error;
    }
  }
};
