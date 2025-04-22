"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, formatDate } from "@/lib/utils";
import { getPromptsOfCreator } from "@/services/prompt";
import { User } from "@/services/user/interface";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface UserDetailProps {
  userData: User;
  className?: string;
}

export default function UserDetail({ userData, className }: UserDetailProps) {
  const commonBackProps = {
    src: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80",
    alt: "Background image",
    sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  };

  const {
    data: userPrompts,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["prompts", "creator", userData.id],
    queryFn: () => getPromptsOfCreator(userData.id),
  });

  return (
    <motion.div
      key="user-detail"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.3 }}
      className={cn(
        "max-w-4xl md:border-2 md:rounded-lg md:p-4 h-fit",
        className,
      )}
    >
      <div className="relative w-full h-32">
        <Image
          src={commonBackProps.src}
          alt={commonBackProps.alt}
          fill
          sizes={commonBackProps.sizes}
          className="absolute inset-0 rounded-xl shadow-xl z-0 opacity-40 object-cover"
        ></Image>
      </div>
      <div className="flex flex-col gap-2 mt-[-3rem] justify-between items-start bg-inherit mx-6">
        <Avatar className="h-16 w-16 rounded-lg">
          {userData && <AvatarImage alt={userData.username} />}
          <AvatarFallback className="rounded-lg">CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <Link
            href={`/profile/${userData.id}`}
            className="text-xl font-semibold hover:underline"
          >
            {userData.username.replace("_", " ")}
          </Link>
          <div className="text-sm italic">{userData.email}</div>
        </div>
      </div>
      <div className="mt-4 mx-1 text-base">{userData.bio}</div>
      <div className="flex flex-col gap-2 mt-4 text-sm italic">
        <div>{isPending || isError ? "..." : userPrompts.length} Prompts</div>
        <div className="flex justify-start items-center gap-1">
          {isPending || isError
            ? "..."
            : userPrompts.reduce(
                (totalStars, prompt) => totalStars + prompt.starCount,
                0,
              )}{" "}
          <Star size={16}></Star>
        </div>
      </div>
      <div className="mt-4 text-sm text-muted-foreground italic">
        Joined at {formatDate(userData.createdAt)}
      </div>
    </motion.div>
  );
}
