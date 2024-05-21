import { defaultProfiles } from "@/lib/constant";
import { db } from "@/lib/db";
import { nanoid } from "nanoid";

export async function GET(req: Request) {
  // SEED DEFAULT USERS
  await Promise.all(
    defaultProfiles.map((profile) => {
      // Write user account to database
      const id = nanoid();
      db.set(`user:email:${profile.email}`, id);
      db.set(`user:${id}`, {
        name: profile.name,
        image: profile.image,
        email: profile.email,
        id,
      });
    })
  );

  return new Response("Seed default users successfully!");
}
