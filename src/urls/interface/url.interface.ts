export interface IUrl {
  id: number;
  userId?: number | null;
  url: string;
  shortUrl: string;
  clickCount: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}
