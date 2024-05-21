import { allProfiles, defaultProfiles } from "@/lib/constant";
import { db } from "@/lib/db";
import { nanoid } from "nanoid";

export async function GET(req: Request) {
  // SEED ALL USERS

  await Promise.all(
    allProfiles.map((profile) => {
      // Write user account to database
      const id = nanoid();
      db.set(`user:email:${profile.email}`, id);
      db.set(`user:${id}`, {
        name: profile.name,
        image: profile.image,
        email: profile.email,
        id,
      });

      // Write to users set
      db.sadd(`users`, {
        name: profile.name,
        image: profile.image,
        email: profile.email,
        id,
      });
    })
  );

  return new Response("Seed all users successfully!");
}
