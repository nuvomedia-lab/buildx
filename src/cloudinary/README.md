# Cloudinary Module

This module provides file upload functionality to Cloudinary, with an exposed endpoint for image uploads and a service for uploading documents programmatically.

## Environment Variables

Add these to your `.env` file:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Endpoints

### POST `/cloudinary/upload/image`

Uploads an image file to Cloudinary.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body:
  - `file` (required): Image file (JPEG, JPG, PNG, GIF, WEBP, SVG)
  - `folder` (optional, query parameter): Folder path in Cloudinary (e.g., `buildx/avatars`)

**Example using cURL:**
```bash
curl -X POST "http://localhost:3000/cloudinary/upload/image?folder=buildx/avatars" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@image.jpg"
```

**Example using JavaScript (FormData):**
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('http://localhost:3000/cloudinary/upload/image?folder=buildx/avatars', {
  method: 'POST',
  body: formData,
});

const result = await response.json();
console.log(result);
```

**Response:**
```json
{
  "url": "http://res.cloudinary.com/...",
  "secureUrl": "https://res.cloudinary.com/...",
  "publicId": "buildx/images/abc123",
  "format": "jpg",
  "resourceType": "image",
  "bytes": 102400,
  "width": 1920,
  "height": 1080
}
```

**Validation:**
- Maximum file size: 5MB
- Allowed image types: JPEG, JPG, PNG, GIF, WEBP, SVG

## Service Usage

The `CloudinaryService` can be imported and used in other modules to upload documents programmatically.

### Example: Upload Document in Service

```typescript
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class MyService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  async uploadDocument(file: Express.Multer.File) {
    // Upload PDF, Excel, Word, etc.
    const result = await this.cloudinaryService.uploadDocument(file, 'buildx/documents');
    return result;
  }
}
```

### Available Service Methods

#### `uploadImage(file: Express.Multer.File, folder?: string, publicId?: string): Promise<UploadResult>`
Uploads an image file to Cloudinary.

#### `uploadDocument(file: Express.Multer.File, folder?: string, publicId?: string): Promise<UploadResult>`
Uploads a document file (PDF, Excel, Word, PowerPoint, CSV) to Cloudinary.

**Supported document types:**
- PDF
- Microsoft Word (.doc, .docx)
- Microsoft Excel (.xls, .xlsx)
- Microsoft PowerPoint (.ppt, .pptx)
- CSV files

#### `deleteFile(publicId: string, resourceType?: 'image' | 'raw' | 'video'): Promise<any>`
Deletes a file from Cloudinary by its public ID.

#### `generateUploadUrl(folder?: string, resourceType?: 'image' | 'raw' | 'video'): { url: string; timestamp: number; signature: string }`
Generates a signed upload URL for client-side uploads.

## Module Export

The `CloudinaryModule` exports `CloudinaryService`, so it can be imported in other modules:

```typescript
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  // ...
})
export class MyModule {}
```

## Notes

- Image uploads are exposed via the `/cloudinary/upload/image` endpoint
- Document uploads are only available through the service (not exposed via endpoint)
- All files are uploaded to Cloudinary with automatic optimization
- Default folder structure:
  - Images: `buildx/images`
  - Documents: `buildx/documents`

