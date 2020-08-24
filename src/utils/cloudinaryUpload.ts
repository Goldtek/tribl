interface CloudinaryUploadType {
  file: string;
  mime: string;
  filename: string;
  cropRect: { width: number; height: number } | null;
}

const cloudinaryUpload = (payload: CloudinaryUploadType): FormData => {
  const { file, mime, filename, cropRect } = payload;

  const data = new FormData();
  data.append('file', file);
  data.append('mimetype', mime);
  data.append('name', filename);
  data.append('width', String(cropRect?.width));
  data.append('height', String(cropRect?.height));
  return data;
};

export default cloudinaryUpload;
