import ENVIRONMENT_VARIABLES from '../config';

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${ENVIRONMENT_VARIABLES.CLOUDINARY_NAME}/image/upload`;

export interface CloudinaryUploadType {
  uri: string;
  mime: string;
  filename: string;
  cropRect: { width: number; height: number } | null;
}

export interface CloudinaryResponseType {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: Date;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  access_mode: string;
}

const cloudinaryUpload = async (payload: CloudinaryUploadType) => {
  const { uri, mime, filename, cropRect } = payload;

  const data = new FormData();
  data.append('file', uri);
  data.append('mimetype', mime);
  data.append('name', filename);
  data.append('width', String(cropRect?.width));
  data.append('height', String(cropRect?.height));
  data.append('upload_preset', ENVIRONMENT_VARIABLES.CLOUDINARY_PRESET);
  data.append('cloud_name', ENVIRONMENT_VARIABLES.CLOUDINARY_NAME);

  return fetch(CLOUDINARY_URL, {
    method: 'POST',
    body: data,
    headers: {
      'Content-Type': 'multipart/form-data',
      accept: 'application/json'
    }
  });
};

export default cloudinaryUpload;
