import axios from 'axios';

const cloudinaryimageUpload = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'thrive_app_images'); // Add upload preset here

  try {
    const response = await axios.post(
      'https://api.cloudinary.com/v1_1/djo6yu43t/image/upload', 
      formData
    );

    return response.data.secure_url; 
  } catch (error) {
    console.error('Error uploading image to Cloudinary', error);
    throw new Error('Failed to upload image');
  }
};

const cloudinaryUpload = async (file: File, type: 'image' | 'video' | 'audio' | 'document'): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'thrive_app_images'); // Add upload preset here

  // Determine the upload URL based on the file type
  let uploadUrl;
  switch (type) {
    case 'image':
      uploadUrl = 'https://api.cloudinary.com/v1_1/djo6yu43t/image/upload';
      break;
    case 'video':
      uploadUrl = 'https://api.cloudinary.com/v1_1/djo6yu43t/video/upload';
      break;
    case 'audio':
      uploadUrl = 'https://api.cloudinary.com/v1_1/djo6yu43t/raw/upload'; // Use raw for audio
      break;
    case 'document':
      uploadUrl = 'https://api.cloudinary.com/v1_1/djo6yu43t/raw/upload';
      break;
    default:
      throw new Error('Unsupported file type');
  }

  try {
    const response = await axios.post(uploadUrl, formData);
    console.log(response);
    
    return response.data.secure_url; 
  } catch (error) {
    console.error(`Error uploading ${type} to Cloudinary`, error);
    throw new Error('Failed to upload file');
  }
};

// Upload multiple images to Cloudinary
export const uploadMultipleImages = async (files: File[]): Promise<string[]> => {
  const uploadPromises = files.map((file) => cloudinaryUpload(file, 'image'));
  const uploadedUrls = await Promise.all(uploadPromises);
  return uploadedUrls;
};

// Upload multiple videos to Cloudinary
export const uploadMultipleVideos = async (files: File[]): Promise<string[]> => {
  const uploadPromises = files.map((file) => cloudinaryUpload(file, 'video'));
  const uploadedUrls = await Promise.all(uploadPromises);
  return uploadedUrls; 
};

// Upload multiple documents to Cloudinary
export const uploadMultipleDocuments = async (files: File[]): Promise<string[]> => {
  const uploadPromises = files.map((file) => cloudinaryUpload(file, 'document'));
  const uploadedUrls = await Promise.all(uploadPromises);
  return uploadedUrls; 
};

// Upload a single audio file to Cloudinary
export const uploadAudioFile = async (audioBlob: Blob): Promise<string> => {
  const file = new File([audioBlob], 'recorded_audio.ogg', { type: 'audio/ogg' });
  return cloudinaryUpload(file, 'audio');
};

export default cloudinaryimageUpload;
