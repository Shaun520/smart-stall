import { Module } from '@nestjs/common';
import { PosterController } from './poster.controller';
import { PosterService } from './poster.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Poster, posterSchema } from './schemas/poster.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Poster.name, schema: posterSchema }]),
  ],
  controllers: [PosterController],
  providers: [PosterService],
})
export class PosterModule {}
