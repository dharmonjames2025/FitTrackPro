const CLOUD_NAME = 'dmumevea8';
const UPLOAD_PRESET = 'fittrack_uploads';

export const cloudinaryService = {
  async uploadImage(uri: string, folder: string): Promise<string> {
    const formData = new FormData();
    
    formData.append('file', {
      uri,
      type: 'image/jpeg',
      name: `${folder}_${Date.now()}.jpg`,
    } as any);
    
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', folder);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.secure_url;
  },

  async uploadProfilePicture(uri: string): Promise<string> {
    return this.uploadImage(uri, 'profile_pictures');
  },

  async uploadProgressPhoto(uri: string): Promise<string> {
    return this.uploadImage(uri, 'progress_photos');
  },

  async uploadMealPhoto(uri: string): Promise<string> {
    return this.uploadImage(uri, 'meal_photos');
  },
};