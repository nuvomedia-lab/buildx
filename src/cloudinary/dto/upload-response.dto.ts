import { ApiProperty } from '@nestjs/swagger';

export class UploadResponseDto {
  @ApiProperty({ description: 'Public URL of the uploaded file', example: 'https://res.cloudinary.com/...' })
  url: string;

  @ApiProperty({ description: 'Secure HTTPS URL of the uploaded file', example: 'https://res.cloudinary.com/...' })
  secureUrl: string;

  @ApiProperty({ description: 'Public ID of the uploaded file', example: 'buildx/images/abc123' })
  publicId: string;

  @ApiProperty({ description: 'File format', example: 'jpg', required: false })
  format?: string;

  @ApiProperty({ description: 'Resource type', example: 'image' })
  resourceType: string;

  @ApiProperty({ description: 'File size in bytes', example: 102400 })
  bytes: number;

  @ApiProperty({ description: 'Image width in pixels', example: 1920, required: false })
  width?: number;

  @ApiProperty({ description: 'Image height in pixels', example: 1080, required: false })
  height?: number;
}

