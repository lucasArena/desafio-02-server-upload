import multer from 'multer';
import crypto from 'crypto';
import { resolve } from 'path';

const tmpDir = resolve(__dirname, '..', '..', 'tmp');

export default {
  directory: tmpDir,
  storage: multer.diskStorage({
    destination: tmpDir,
    filename: (request, file, callback) => {
      const randon = crypto.randomBytes(8).toString('HEX');
      return callback(null, `${randon}-${file.originalname}`);
    },
  }),
};
