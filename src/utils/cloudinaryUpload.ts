import ENVIRONMENT_VARIABLES from '../config';

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${ENVIRONMENT_VARIABLES.CLOUDINARY_NAME}/image/upload`;

export interface CloudinaryUploadType {
  file: string;
  mime: string;
  filename: string;
  cropRect: { width: number; height: number } | null;
}

const cloudinaryUpload = async (payload: CloudinaryUploadType) => {
  const { file, mime, filename, cropRect } = payload;

  const data = new FormData();
  data.append('file', file);
  data.append('upload_preset', ENVIRONMENT_VARIABLES.CLOUDINARY_PRESET);
  data.append('cloud_name', ENVIRONMENT_VARIABLES.CLOUDINARY_NAME);
  data.append('api_key', ENVIRONMENT_VARIABLES.CLOUDINARY_API_KEY);
  data.append('mimetype', mime);
  data.append('name', filename);
  data.append('width', String(cropRect?.width));
  data.append('height', String(cropRect?.height));

  return fetch(CLOUDINARY_URL, {
    method: 'POST',
    body: data,
    headers: { 'content-type': 'application/json' }
  });
};

export default cloudinaryUpload;
