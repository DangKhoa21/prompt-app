import { cookies } from "next/headers";

export async function GET() {
  const token = cookies().get("token")?.value ?? null;
  return Response.json({ token });
}

export async function POST(req: Request) {
  const { token } = await req.json();
  const cookieStore = cookies();

  if (token) {
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 6, // 6 hours
    });
  } else {
    cookieStore.delete("token");
  }
  console.log(token);

  return new Response(null, { status: 200 });
}
