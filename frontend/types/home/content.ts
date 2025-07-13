export interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
}

export interface Technique {
  icon: React.ElementType;
  name: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
}

export interface Stat {
  label: string;
  value: string;
  icon: React.ElementType;
}
