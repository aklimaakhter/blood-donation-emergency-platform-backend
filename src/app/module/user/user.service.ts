import { UploadApiResponse } from "cloudinary";
import { cloudinary } from "../../lib/cloudinary";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import httpStatus from "http-status";

const uploadProfileImage = async (buffer: Buffer, userId: string) => {

  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      imagePublicId: true,
      imageUrl: true,
    },
  });

  if (!currentUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  
  const cloudinaryResult = await new Promise<UploadApiResponse>(
    (resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "blood_donation/profile_images", 
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          if (!result) {
            return reject(new Error("Failed to upload image to Cloudinary"));
          }
          resolve(result);
        }
      );
      uploadStream.end(buffer);
    }
  );

 
  if (currentUser.imagePublicId) {
    try {
      await cloudinary.uploader.destroy(currentUser.imagePublicId);
    } catch (err) {
      console.error("Failed to delete previous profile image from Cloudinary:", err);
    }
  }

  
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      imageUrl: cloudinaryResult.secure_url,
      imagePublicId: cloudinaryResult.public_id,
    },
    omit: {
      password: true,
    },
  });

  return updatedUser;
};

export const UserServices = {
  uploadProfileImage,
};