import ENVIRONMENT_VARIABLES from '../config';
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${ENVIRONMENT_VARIABLES.CLOUDINARY_NAME}/image/upload`;

export interface CloudinaryUploadType {
  uri: string;
  mime: 'image' | 'video' | undefined;
  cropRect?: { width: number; height: number } | null;
}

export interface CloudinaryResponseType {
  url: string;
  type: string;
  etag: string;
  bytes: number;
  width: number;
  height: number;
  tags: string[];
  format: string;
  version: number;
  asset_id: string;
  created_at: Date;
  public_id: string;
  signature: string;
  version_id: string;
  secure_url: string;
  access_mode: string;
  placeholder: boolean;
  resource_type: string;
}

const cloudinaryUpload = async (payload: CloudinaryUploadType) => {
  const { uri, mime, cropRect } = payload;
  const data = new FormData();
  data.append('file', uri);
  data.append('mimetype', `${mime!!}`);
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
