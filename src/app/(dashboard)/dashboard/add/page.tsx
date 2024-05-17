import AddFriendButton from "@/components/add-friend-btn";
import React from "react";

async function Page() {
  return (
    <main className="space-y-8">
      <h2 className="text-2xl">Add a friend</h2>
      <AddFriendButton />
    </main>
  );
}

export default Page;
