export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image?: string;
  fallbackColor?: string;
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
