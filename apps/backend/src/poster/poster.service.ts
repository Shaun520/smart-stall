import { Injectable } from '@nestjs/common';
import { Poster, PosterDocument } from './schemas/poster.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createPosterDto } from './dto/poster.dto';

@Injectable()
export class PosterService {
  constructor(
    @InjectModel(Poster.name)
    private readonly posterModel: Model<PosterDocument>,
  ) {}
  //新增海报
  async createPoster(body: createPosterDto, ownerId: string) {
    const newPoster = new this.posterModel({ ...body, ownerId });
    await newPoster.save();
    return {};
  }
  //获取我的海报列表
  async getMyPosters(ownerId: string) {
    const posters = await this.posterModel.find({ ownerId });
    return posters;
  }
  //获取海报详情
  async getPosterDetail(_id: string) {
    const poster = await this.posterModel.findById(_id);
    return poster;
  }
  //删除海报
  async deletePoster(id: string) {
    await this.posterModel.findByIdAndDelete(id);
    return {};
  }
  //修改海报
  async updatePoster(id: string, body: createPosterDto) {
    await this.posterModel.findByIdAndUpdate(id, body);
    return {};
  }
}
