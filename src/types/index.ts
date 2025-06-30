export interface IArticle {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image?: string;
  content: string;
  ca?: string;
}

export interface User {
  name: string;
  username: string;
  walletAddress: string;
  bio: string;
  socialLinks: {
    twitter: string;
    github: string;
    linkedin: string;
  };
}

export interface UserDetail {
  user: User;
  total_followers: number;
  total_articles: number;
  total_following: number;
}
