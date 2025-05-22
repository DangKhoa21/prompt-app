import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Badge } from "lucide-react";

export default function UserExpertise() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Expertise</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            Not yet available
            {/* {userData.expertise.map((skill) => ( */}
            {/*   <Badge key={skill} variant="secondary"> */}
            {/*     {skill} */}
            {/*   </Badge> */}
            {/* ))} */}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
