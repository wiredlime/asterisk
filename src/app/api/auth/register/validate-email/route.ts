import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Re-validate data from the client
    const { email } = body;

    // Check if email exist
    const isExist = await db.exists(`user:email:${email}`);
    if (isExist) {
      return new Error("Email already exist");
    }

    return new Response("OK", { status: 200 });
  } catch (e) {
    console.log({ e });
    return new Error("Invalid email");
  }

  return new Response("ok");
}
