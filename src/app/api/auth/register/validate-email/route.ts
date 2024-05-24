import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Re-validate data from the client
    const { email } = body;

    // Check if email exist
    const isExist = await db.exists(`user:email:${email}`);
    if (isExist) {
      return new Response("Email already exist", { status: 403 });
    }

    return new Response("OK", { status: 200 });
  } catch (e) {
    console.log({ e });
    return new Response("Invalid email", { status: 403 });
  }
}
