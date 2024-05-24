import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { addFriendValidator } from "@/lib/validations/add-friend";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email: emailToUnfriend } = addFriendValidator.parse(body.email); //using the same validator for unfriend and add friend

    // 1. Validate action performer
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    // 2. Find userId of emailToUnfriend
    const idToUnfriend = await db.get(`user:email:${emailToUnfriend}`);

    if (!idToUnfriend) {
      return new Response("Email doesn't exist", { status: 403 });
    }

    // 3. Remove the userId id user:id:friends set
    await db.srem(`user:${session.user.id}:friends`, idToUnfriend);

    return new Response(`OK`);
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }
    return new Response("Invalid request", { status: 400 });
  }
}
