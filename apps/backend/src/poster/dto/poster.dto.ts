export class createPosterDto {
  title?: string;
  description?: string;
  image?: string;
  size?: string;
  style?: 'simple' | 'color' | 'minimalist' | 'retro';
  viewCount?: number;
  downloadCount?: number;
}
