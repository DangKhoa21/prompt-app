"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/services/user/interface";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface UserOverviewCardProps {
  userData: User;
}

export default function UserOverviewCard({ userData }: UserOverviewCardProps) {
  return (
    <>
      <motion.div
        key="user-overview"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>About the creator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={"/placeholder.svg"} alt={userData.username} />
                <AvatarFallback>{userData.username.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-1">
                  <p className="font-medium">{userData.username}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {userData.email}
                </p>
              </div>
            </div>

            <p className="text-sm line-clamp-3">{userData.bio}</p>

            <Button variant="outline" className="w-full" asChild>
              <Link href={`/profile/${userData.id}`}>
                View Profile
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
}
