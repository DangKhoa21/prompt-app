import Container from "@/components/container";
import { Skeleton } from "@workspace/ui/components/skeleton";

export default function TemplateLoading() {
  function HeadComponent({
    keyValue,
    isTags = false,
  }: {
    keyValue: string;
    isTags?: boolean;
  }) {
    return (
      <div
        key={keyValue}
        className="w-full flex flex-col gap-1 md:flex-row md:gap-0 justify-start md:items-center"
      >
        <Skeleton className="h-7 my-2 basis-2/12" />
        <div className="flex-1"></div>
        {isTags ? (
          <div className="flex gap-2 flex-wrap basis-4/5">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-7 w-16 rounded-full" />
            ))}
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
        ) : (
          <Skeleton className="h-7 my-2 basis-4/5" />
        )}
      </div>
    );
  }
  return (
    <Container>
      <div className="min-h-screen w-11/12 mx-auto bg-background">
        {/* Template title, description and tags section */}
        <div className="w-full h-full mx-auto space-y-6">
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <HeadComponent key={i} keyValue={`item-${i}`} isTags={i === 2} />
            ))}
          </div>

          {/* Template tabs section */}
          <Skeleton className="h-10 w-full" />

          <div className="pt-2 grid gap-6 lg:grid-cols-2">
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

          {/* Bottom Buttons section */}
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
