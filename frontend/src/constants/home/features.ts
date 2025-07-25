import { appURL } from "@/config/url.config";
import { Feature } from "@/types/home/content";
import { BookOpen, Users, Brain, MessageSquare } from "lucide-react";

export const features: Feature[] = [
  {
    icon: BookOpen,
    title: "Smart Templates",
    description:
      "Create reusable prompt templates with variables and configurations for consistent results.",
    href: appURL.templates,
  },
  {
    icon: Users,
    title: "Community Marketplace",
    description:
      "Discover and share prompts with a vibrant community of AI enthusiasts and professionals.",
    href: appURL.marketplace,
  },
  {
    icon: Brain,
    title: "Advanced Techniques",
    description:
      // "Master prompt engineering with interactive guides for few-shot, chain-of-thought, and more.",
      "Master prompt engineering with guides for few-shot, chain-of-thought, and more.",
    href: appURL.techniques,
  },
  {
    icon: MessageSquare,
    title: "AI Chat Assistant",
    description:
      "Test your prompts in real-time with our integrated chat interface and technique builders.",
    href: appURL.chat,
  },
];
