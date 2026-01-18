
import { supabase } from '../client';

export class StorageRepository {
    private bucket = 'dishes';

    /**
     * Uploads a file to Supabase Storage.
     * @param file The file object from browser input.
     * @param path The destination path in the bucket.
     * @returns The public URL of the uploaded image.
     */
    async uploadImage(file: File, path: string): Promise<string> {
        const { data, error } = await supabase.storage
            .from(this.bucket)
            .upload(path, file, {
                cacheControl: '3600',
                upsert: true
            });

        if (error) {
            console.error('Storage Upload Error:', error);
            throw new Error(`Failed to upload image: ${error.message}`);
        }

        const { data: { publicUrl } } = supabase.storage
            .from(this.bucket)
            .getPublicUrl(data.path);

        return publicUrl;
    }

    /**
     * Deletes an image from storage.
     */
    async deleteImage(path: string): Promise<void> {
        const { error } = await supabase.storage
            .from(this.bucket)
            .remove([path]);

        if (error) {
            console.error('Storage Delete Error:', error);
        }
    }

    async uploadDishImage(file: File): Promise<string> {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `dishes/${fileName}`;

        return this.uploadImage(file, filePath);
    }

    async uploadProfileImage(file: File, userId: string): Promise<string> {
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}-${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        return this.uploadImage(file, filePath);
    }
}
