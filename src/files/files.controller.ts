import {
  Controller,
  Delete,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { GetCurrentUserId } from './../common/decorators/user-id.decorator';
import { FileType } from './entities/file.entity';
import { FilesService } from './files.service';
import { fileStorage } from './storage';

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', { storage: fileStorage }))
  create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 })],
      }),
    )
    file: Express.Multer.File,
    @GetCurrentUserId() userId: number,
  ) {
    return this.filesService.create(file, userId);
  }

  @Get()
  findAll(
    @GetCurrentUserId() userId: number,
    @Query('type') fileType: FileType,
  ) {
    return this.filesService.findAll(userId, fileType);
  }

  @Delete()
  remove(@GetCurrentUserId() userId: number, @Query('ids') ids: string) {
    return this.filesService.remove(userId, ids);
  }
}
