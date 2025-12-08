export interface Trip {
  id: string;
  title: string;
  location: string;
  date: string;
  images: string[]; // Changed from imageUrl to support multiple photos
  description: string;
}

export interface Skill {
  name: string;
  level: number; // 0-100
  category: 'Tech' | 'Creative' | 'Language';
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  timeframe: string;
  icon: 'mountain' | 'compass' | 'rocket' | 'heart';
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string; // YYYY.MM
  description?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  link?: string;
}