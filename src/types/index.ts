export interface IArticle {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image?: string;
  content: string;
  ca?: string;
  is_published: boolean;
}

export interface User {
  name: string;
  wallet_address: string;
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
