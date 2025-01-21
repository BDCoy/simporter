import { Author } from "./author";

export interface Report {
  id: number;
  title: string;
  author: Author;
  date: string;
  likes: number;
  shares: number;
  liked: boolean;
  totalSlides: number;
}
