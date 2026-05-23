import { cloudinaryService } from './cloudinaryService';

export const storageService = {
  async uploadProfilePicture(userId: string, uri: string): Promise<string> {
    try {
      return await cloudinaryService.uploadProfilePicture(uri);
    } catch (error) {
      console.log('Cloudinary failed, using local URI');
      return uri;
    }
  },

  async uploadProgressPhoto(userId: string, uri: string): Promise<string> {
    try {
      return await cloudinaryService.uploadProgressPhoto(uri);
    } catch (error) {
      return uri;
    }
  },

  async uploadMealPhoto(userId: string, uri: string): Promise<string> {
    try {
      return await cloudinaryService.uploadMealPhoto(uri);
    } catch (error) {
      return uri;
    }
  },

  uploadPostMedia: async (userId: string, uri: string) => uri,
  deleteFile: async (filePath?: string) => {},
};