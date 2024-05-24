"use client";
import React, { useEffect, useMemo, useState } from "react";
import NextAvatar from "./ui/next-avatar";
import NewMessageForm from "./new-message-form";
import FriendActionButton from "./friend-action-button";
import { Input } from "./ui/input";
import { Loader2, Search } from "lucide-react";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { da } from "@faker-js/faker";

export const SearchFriendFormSchema = z.object({
  name: z.string(),
});

export type SearchFriendFormData = z.infer<typeof SearchFriendFormSchema>;

type FriendListProps = {
  friends: User[];
  sessionId: string;
};

// render lists
// form to filter list
function FriendList({ friends, sessionId }: FriendListProps) {
  const [filteredFriends, setFilteredFriends] = useState(friends);
  const { register, handleSubmit } = useForm<SearchFriendFormData>({
    resolver: zodResolver(SearchFriendFormSchema),
  });

  const onSubmit = (data: SearchFriendFormData) => {
    const filteredFriends = friends.filter((friend) => {
      if (friend.name?.toLowerCase().includes(data.name.toLowerCase())) {
        return true;
      }
    });
    setFilteredFriends(filteredFriends);
  };

  return (
    <div>
      <form
        className="flex flex-row justify-end gap-4 p-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          {...register("name")}
          className="max-w-sm"
          name="name"
          placeholder="Look friend up by their name..."
          startAdornment={<Search className="w-4 h-4" />}
        />
        <Button size="sm" type="submit">
          Search
        </Button>
      </form>
      {filteredFriends.length ? (
        <div className="flex flex-wrap gap-10 p-10 w-full">
          {filteredFriends.map((friend) => (
            <div
              key={friend.id}
              className="w-56 h-56 flex flex-col justify-center items-center gap-2  p-4 border rounded-2xl shadow-sm"
            >
              <div className="grid place-items-center">
                <div className="flex-shrink-0 mb-4">
                  <NextAvatar
                    src={friend.image || ""}
                    alt={`${friend.name} profile picture`}
                    className="w-20 h-20"
                  />
                </div>
                <p className="text-sm font-medium">{friend.name}</p>
                <p className="text-sm text-muted-foreground">{friend.email}</p>
              </div>
              <div className="w-full flex items-center gap-2">
                <NewMessageForm
                  defaultChatPartner={friend}
                  sessionId={sessionId}
                  friends={friends}
                />
                <FriendActionButton
                  isFriend={true}
                  friendEmail={friend.email || ""}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid place-items-center py-10">
          <p className="text-muted-foreground">
            You have no friends yet, let&apos;s add some
          </p>
        </div>
      )}
    </div>
  );
}

export default FriendList;
