// src/upload/upload.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  HttpStatus,
  UploadedFiles,
  BadRequestException,
  Body,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { OssService } from '../oss/oss.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly ossService: OssService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
        ],
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    file: Express.Multer.File,
  ) {
    const fileUrl = await this.ossService.uploadBuffer(file);

    return {
      url: fileUrl,
      filename: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const fileUrl = await this.ossService.uploadBuffer(file);

    return {
      url: fileUrl,
      filename: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', 5)) // 最多5个文件
  async uploadMultipleFiles(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 每个文件最大5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif|webp)$/ }), // 只允许图片格式
        ],
      }),
    )
    files: Array<Express.Multer.File>,
  ) {
    // 验证文件数量
    if (!files || files.length === 0) {
      throw new BadRequestException('请选择要上传的图片');
    }

    // 验证每个文件类型
    for (const file of files) {
      if (!file.mimetype.match(/(jpg|jpeg|png|gif|webp)$/)) {
        throw new BadRequestException(
          `文件 ${file.originalname} 不是支持的图片格式`,
        );
      }
    }

    try {
      const uploadPromises = files.map((file) =>
        this.ossService.uploadBuffer(file),
      );

      const urls = await Promise.all(uploadPromises);

      return {
        total: files.length,
        images: urls.map((url, index) => ({
          url,
          filename: files[index].originalname,
          size: files[index].size,
          mimetype: files[index].mimetype,
          uploadTime: new Date().toISOString(),
        })),
      };
    } catch (error) {
      throw new BadRequestException(`图片上传失败: ${error.message}`);
    }
  }
}
