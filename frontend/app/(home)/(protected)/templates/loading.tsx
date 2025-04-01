import { LoadingSpinner } from "@/components/icons";

export default function Loading() {
  return (
    <>
      <div className="flex h-full justify-center items-center">
        <LoadingSpinner></LoadingSpinner>
      </div>
    </>
  );
}
