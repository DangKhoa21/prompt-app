import Container from "@/components/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function TemplateLoading() {
  return (
    <Container>
      <div className="min-h-screen w-11/12 mx-auto bg-background">
        <div className="flex flex-col px-5">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 my-4 basis-2/12" />
            <div className=""></div>
            <Skeleton className="h-8 my-4 basis-4/5" />
          </div>

          <div className="flex items-center justify-between">
            <Skeleton className="h-7 my-4 basis-2/12" />
            <div className=""></div>
            <Skeleton className="h-7 my-4 basis-4/5" />
          </div>

          <div className="flex items-center gap-4">
            <Skeleton className="h-6 basis-2/12" />
            <div className=""></div>
            <div className="flex gap-2 flex-wrap basis-4/5">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-6 w-16 rounded-full" />
              ))}
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
          </div>
        </div>

        <div>
          <Skeleton className="h-10 w-full" />

          <div className="py-4 grid gap-6 lg:grid-cols-2">
            <div className="space-y-4 h-fit border rounded-lg p-6">
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-8 w-32" />
              </div>
              <Skeleton className="h-[200px] w-full rounded-md" />
            </div>

            <div className="space-y-4">
              <div className="flex h-11 justify-between items-center">
                <Skeleton className="h-7 m-2 w-24" />
                <Skeleton className="h-8 w-44" />
              </div>
              <div className="space-y-4 border rounded-md p-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-md" />
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Buttons */}
          <div className="grid sticky bottom-0 p-2 bg-background w-full items-center justify-end md:grid-cols-2">
            <div className="flex justify-end">
              <Skeleton className="h-10 w-24" />
            </div>
            <div className="flex gap-4 justify-end">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
