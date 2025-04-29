"use client";

import { formatDate } from "@/lib/utils";
import { getPromptsOfCreator } from "@/services/prompt";
import { User } from "@/services/user/interface";
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UserAboutProps {
  userData: User;
}

export default function UserAbout({ userData }: UserAboutProps) {
  const mockLocation = "San Francisco, CA";
  const mockSocialLinks = [
    { platform: "Twitter", url: "https://twitter.com/example" },
    { platform: "LinkedIn", url: "https://linkedin.com/in/example" },
  ];
  const mockSkills = ["JavaScript", "React", "Next.js", "TypeScript"];

  const {
    data: userPrompts,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["prompts", "creator", userData.id],
    queryFn: () => getPromptsOfCreator(userData.id),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>About</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>{userData.bio}</p>

        {/* New Section: Location */}
        <div className="mt-4 text-sm">
          <strong>Location:</strong> {mockLocation}
        </div>

        {/* New Section: Social Media Links */}
        <div className="mt-4 text-sm">
          <strong>Social Media:</strong>
          <ul className="list-disc list-inside">
            {mockSocialLinks.map((link, index) => (
              <li key={index}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {link.platform}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* New Section: Skills */}
        <div className="mt-4 text-sm">
          <strong>Skills:</strong>
          <ul className="list-disc list-inside">
            {mockSkills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </div>

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

        {/* {userData.location && ( */}
        {/*   <div className="flex items-center gap-2"> */}
        {/*     <Globe className="h-4 w-4 text-muted-foreground" /> */}
        {/*     <span>{userData.location}</span> */}
        {/*   </div> */}
        {/* )} */}

        {/* {userData.website && ( */}
        {/*   <div className="flex items-center gap-2"> */}
        {/*     <Globe className="h-4 w-4 text-muted-foreground" /> */}
        {/*     <a */}
        {/*       href={userData.website} */}
        {/*       target="_blank" */}
        {/*       rel="noopener noreferrer" */}
        {/*       className="text-primary hover:underline" */}
        {/*     > */}
        {/*       {userData.website.replace(/^https?:\/\//, "")} */}
        {/*     </a> */}
        {/*   </div> */}
        {/* )} */}

        {/* <div className="flex gap-3"> */}
        {/*   {userData.socialLinks.twitter && ( */}
        {/*     <Button variant="outline" size="icon" asChild> */}
        {/*       <a */}
        {/*         href={`https://twitter.com/${userData.socialLinks.twitter}`} */}
        {/*         target="_blank" */}
        {/*         rel="noopener noreferrer" */}
        {/*         aria-label="Twitter" */}
        {/*       > */}
        {/*         <Twitter className="h-4 w-4" /> */}
        {/*       </a> */}
        {/*     </Button> */}
        {/*   )} */}
        {/*   {userData.socialLinks.github && ( */}
        {/*     <Button variant="outline" size="icon" asChild> */}
        {/*       <a */}
        {/*         href={`https://github.com/${userData.socialLinks.github}`} */}
        {/*         target="_blank" */}
        {/*         rel="noopener noreferrer" */}
        {/*         aria-label="GitHub" */}
        {/*       > */}
        {/*         <Github className="h-4 w-4" /> */}
        {/*       </a> */}
        {/*     </Button> */}
        {/*   )} */}
        {/*   {userData.socialLinks.linkedin && ( */}
        {/*     <Button variant="outline" size="icon" asChild> */}
        {/*       <a */}
        {/*         href={`https://linkedin.com/in/${userData.socialLinks.linkedin}`} */}
        {/*         target="_blank" */}
        {/*         rel="noopener noreferrer" */}
        {/*         aria-label="LinkedIn" */}
        {/*       > */}
        {/*         <Linkedin className="h-4 w-4" /> */}
        {/*       </a> */}
        {/*     </Button> */}
        {/*   )} */}
        {/* </div> */}
      </CardContent>
    </Card>
  );
}
