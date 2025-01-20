export interface Profile {
  id: string;
  codingProfiles: CodingProfile[];
  linkedinUrl: string;
  workExperience: WorkExperience[];
  projects: Project[];
  rating?: number;
  badgeUrl?: string;
}

export interface CodingProfile {
  platform: string;
  username: string;
  url: string;
}

export interface WorkExperience {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  url?: string;
}