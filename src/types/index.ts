export interface IArticle {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image?: string;
  fallbackColor?: string;
  content: string;
}

export interface ExtractedColors {
  [index: number]: {
    gradient: string;
    textColor: string;
    isDark: boolean;
  };
}

export interface ColorData {
  gradient: string;
  textColor: string;
  isDark: boolean;
}

export interface User {
  name: string;
  username: string;
  bio: string;
  avatar: string;
  coverImage: string;
  location: string;
  joinDate: string;
  website: string;
  followers: number;
  following: number;
  articles: number;
  socialLinks: {
    twitter: string;
    github: string;
    linkedin: string;
  };
}
