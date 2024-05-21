import { db } from "@/lib/db";
import { signUpValidator } from "@/lib/validations/sign-up";
import { nanoid } from "nanoid";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Re-validate data from the client
    const { email, name, image } = signUpValidator.parse(body);

    // Check if email exist
    const isExist = await db.exists(`user:email:${email}`);
    if (isExist) {
      return new Response("Email already exist", { status: 403 });
    }

    // Generate id for new user
    const id = nanoid();

    // Write user account to database
    db.set(`user:email:${email}`, id);
    db.set(`user:${id}`, {
      name,
      image,
      email,
      id,
    });

    return new Response("OK", { status: 200 });
  } catch (e) {
    console.log({ e });
  }

  return new Response("ok");
}
