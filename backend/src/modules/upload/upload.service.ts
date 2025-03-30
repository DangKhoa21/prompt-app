import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ObjectCannedACL,
} from '@aws-sdk/client-s3';
import { AppError, config } from 'src/shared';
import {
  ErrAvatarDeleteFailed,
  ErrAvatarUploadFailed,
  ErrInvalidFileUrl,
} from './model';

@Injectable()
export class UploadService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly region: string;

  constructor() {
    this.s3Client = new S3Client({
      region: config.aws.s3.region,
      credentials: {
        accessKeyId: config.aws.s3.accessKeyId,
        secretAccessKey: config.aws.s3.secretAccessKey,
      },
    });
    this.bucketName = config.aws.s3.bucketName;
    this.region = config.aws.s3.region;
  }

  async uploadAvatar(
    file: Express.Multer.File,
    userId: string,
  ): Promise<string> {
    const filename = `avatars/${userId}-avatar`; // same filename to overwrite when update

    const uploadParams = {
      Bucket: this.bucketName,
      Key: filename,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read' as ObjectCannedACL,
    };

    try {
      await this.s3Client.send(new PutObjectCommand(uploadParams));

      return `https://${this.bucketName}.s3.amazonaws.com/${filename}`;
    } catch (error) {
      console.error('S3 Upload Error:', error);
      throw AppError.from(ErrAvatarUploadFailed, 500);
    }
  }

  async deleteAvatar(fileUrl: string): Promise<void> {
    const key = fileUrl.split(
      `https://${this.bucketName}.s3.${this.region}.amazonaws.com/`,
    )[1];

    if (!key) {
      throw AppError.from(ErrInvalidFileUrl, 400);
    }

    const deleteParams = {
      Bucket: this.bucketName,
      Key: key,
    };

    // not check if the file exists yet

    try {
      await this.s3Client.send(new DeleteObjectCommand(deleteParams));
    } catch (error) {
      console.error('S3 Delete Error:', error);
      throw AppError.from(ErrAvatarDeleteFailed, 500);
    }
  }
}
