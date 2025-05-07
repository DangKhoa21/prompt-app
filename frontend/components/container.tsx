export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-screen-xl w-full mx-auto space-y-6">{children}</div>
  );
}
