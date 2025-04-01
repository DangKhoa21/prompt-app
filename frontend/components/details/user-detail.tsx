"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { User } from "@/services/user/interface";
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

  return (
    <motion.div
      key="user-detail"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.3 }}
      className={cn("md:border-2 md:rounded-lg md:p-4 h-fit", className)}
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
      <div className="mt-4 mx-1 text-base">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </div>
      <div className="flex flex-col gap-2 mt-4 text-sm italic">
        <div>7 Prompts</div>
        <div className="flex justify-start items-center gap-1">
          10 <Star size={16}></Star>
        </div>
      </div>
      <div className="mt-4 text-sm text-muted-foreground italic">
        Joined at: {new Date(userData.createdAt).toLocaleDateString()}
      </div>
    </motion.div>
  );
}
