import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

interface CloudinaryUploadResult {
  [key: string]: string;
}

export const uploadImage = async (image: File) => {
  try {
    if (!image) {
      return NextResponse.json({
        error: "File not found"
      }, {
        status: 400
      })
    }

    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const result = await new Promise<CloudinaryUploadResult>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "MERNBlogNextJs",
            resource_type: 'auto',
            quality: 'auto'
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as CloudinaryUploadResult);
          }
        )
        uploadStream.end(buffer)
      }
    )
    return result.url
  } catch (error) {
    console.log('Error while uploading image', error);
    return NextResponse.json({
      success: false,
      message: 'Image upload failed!'
    }, {
      status: 500
    })
  }
}

export const deleteImage = async (imageUrl: string) => {
  try {
    if (!imageUrl) return null
    const parts = imageUrl.split('/');
    const publicId = `${parts[parts.length - 2]}/${parts[parts.length - 1].split('.')[0]}`;
    await cloudinary.api.delete_resources([publicId], {
      type: 'upload',
      resource_type: 'image'
    });
  } catch (error) {
    console.log('Error while deleting image', error);
  }
}

export const updateImage = async (image: File, oldImageUrl: string) => {
  await deleteImage(oldImageUrl);
  return await uploadImage(image);
}