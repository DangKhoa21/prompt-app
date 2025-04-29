import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Award, Zap, Heart } from "lucide-react";

export default function UserAchievements() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* {userData.achievements.map((achievement) => ( */}
          {/*   <div */}
          {/*     key={achievement.id} */}
          {/*     className="flex items-start gap-3" */}
          {/*   > */}
          {/*     <div className="bg-primary/10 p-2 rounded-full"> */}
          {/*       {achievement.icon === "award" && ( */}
          {/*         <Award className="h-5 w-5 text-primary" /> */}
          {/*       )} */}
          {/*       {achievement.icon === "zap" && ( */}
          {/*         <Zap className="h-5 w-5 text-amber-500" /> */}
          {/*       )} */}
          {/*       {achievement.icon === "heart" && ( */}
          {/*         <Heart className="h-5 w-5 text-red-500" /> */}
          {/*       )} */}
          {/*     </div> */}
          {/*     <div> */}
          {/*       <h3 className="font-medium">{achievement.title}</h3> */}
          {/*       <p className="text-sm text-muted-foreground"> */}
          {/*         {achievement.description} */}
          {/*       </p> */}
          {/*       <p className="text-xs text-muted-foreground mt-1"> */}
          {/*         {formatDate(achievement.date)} */}
          {/*       </p> */}
          {/*     </div> */}
          {/*   </div> */}
          {/* ))} */}
        </CardContent>
      </Card>
    </>
  );
}
