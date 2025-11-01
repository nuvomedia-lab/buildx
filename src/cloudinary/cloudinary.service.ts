import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

export interface UploadResult {
  url: string;
  publicId: string;
  secureUrl: string;
  format: string;
  resourceType: string;
  bytes: number;
  width?: number;
  height?: number;
}

@Injectable()
export class CloudinaryService {
  constructor() {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  /**
   * Upload an image file to Cloudinary
   * @param file - The file buffer or path
   * @param folder - Optional folder path in Cloudinary
   * @param publicId - Optional custom public ID
   * @returns Upload result with URL and metadata
   */
  async uploadImage(
    file: Express.Multer.File,
    folder?: string,
    publicId?: string,
  ): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      const uploadOptions: any = {
        resource_type: 'image',
        folder: folder || 'buildx/images',
      };

      if (publicId) {
        uploadOptions.public_id = publicId;
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) {
            reject(new BadRequestException(`Image upload failed: ${error.message}`));
            return;
          }

          resolve({
            url: result.url,
            secureUrl: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            resourceType: result.resource_type,
            bytes: result.bytes,
            width: result.width,
            height: result.height,
          });
        },
      );

      uploadStream.end(file.buffer);
    });
  }

  /**
   * Upload a document file (PDF, Excel, Word, etc.) to Cloudinary
   * @param file - The file buffer
   * @param folder - Optional folder path in Cloudinary
   * @param publicId - Optional custom public ID
   * @returns Upload result with URL and metadata
   */
  async uploadDocument(
    file: Express.Multer.File,
    folder?: string,
    publicId?: string,
  ): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      // Validate file type
      const allowedMimeTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      ];

      if (!allowedMimeTypes.includes(file.mimetype)) {
        reject(
          new BadRequestException(
            `Unsupported document type. Allowed types: PDF, Word, Excel, PowerPoint, CSV`,
          ),
        );
        return;
      }

      const uploadOptions: any = {
        resource_type: 'raw',
        folder: folder || 'buildx/documents',
      };

      if (publicId) {
        uploadOptions.public_id = publicId;
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) {
            reject(new BadRequestException(`Document upload failed: ${error.message}`));
            return;
          }

          resolve({
            url: result.url,
            secureUrl: result.secure_url,
            publicId: result.public_id,
            format: result.format || file.mimetype,
            resourceType: result.resource_type,
            bytes: result.bytes,
          });
        },
      );

      uploadStream.end(file.buffer);
    });
  }

  /**
   * Delete a file from Cloudinary by public ID
   * @param publicId - The public ID of the file to delete
   * @param resourceType - The resource type (image, raw, video)
   * @returns Deletion result
   */
  async deleteFile(publicId: string, resourceType: 'image' | 'raw' | 'video' = 'image') {
    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
      });
      return result;
    } catch (error) {
      throw new BadRequestException(`Failed to delete file: ${error.message}`);
    }
  }

  /**
   * Generate a signed upload URL for client-side uploads
   * @param folder - Folder path in Cloudinary
   * @param resourceType - Type of resource (image, raw, video)
   * @returns Signed upload URL and parameters
   */
  generateUploadUrl(
    folder?: string,
    resourceType: 'image' | 'raw' | 'video' = 'image',
  ): { url: string; timestamp: number; signature: string } {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const params: any = {
      folder: folder || (resourceType === 'image' ? 'buildx/images' : 'buildx/documents'),
      timestamp,
    };

    const signature = cloudinary.utils.api_sign_request(
      params,
      process.env.CLOUDINARY_API_SECRET || '',
    );

    return {
      url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
      timestamp,
      signature,
    };
  }
}

