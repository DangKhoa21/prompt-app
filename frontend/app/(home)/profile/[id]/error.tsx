"use client";

export default function Error({ error }: { error: Error }) {
  return (
    <div className="flex flex-col h-full items-center justify-center text-red-400">
      <h2 className="text-xl font-bold">Failed to load profile.</h2>
      <p>{error.message}</p>
    </div>
  );
}
