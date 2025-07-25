import { Stat } from "@/types/home/content";
import { BookOpen, Users } from "lucide-react";

export const stats: Stat[] = [
  { label: "Active Users", value: "10+", icon: Users },
  { label: "Prompt Templates", value: "50+", icon: BookOpen },
  // { label: "Success Rate", value: "80%", icon: TrendingUp },
  // { label: "Countries", value: "120+", icon: Globe },
];
