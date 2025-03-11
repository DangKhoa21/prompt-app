interface UserDetailProps {
  userId: string;
}
export default function UserDetail({ userId }: UserDetailProps) {
  return (
    <>
      <div>{userId}</div>
    </>
  );
}
