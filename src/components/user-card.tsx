"use client";
import { useState } from "react";
import { Separator } from "./ui/separator";
import NextAvatar from "./ui/next-avatar";
import { Button } from "./ui/button";
import { UserCheck } from "lucide-react";

type UserCardProps = {
  isFriend: boolean;
  userId: string;
  name: string;
  email: string;
  image: string;
};

const UserCard = ({ isFriend, name, email, image, userId }: UserCardProps) => {
  const [friend, setFriend] = useState(isFriend);

  const handleAddFriend = () => {
    setFriend(true);
  };
  const handleUnfriend = () => {
    setFriend(false);
  };
  return (
    <div>
      <div className="flex items-start gap-2">
        <div className="space-y-1">
          <h4 className="text-sm font-medium leading-none">{name}</h4>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
      </div>
      <Separator className="my-2" />
      <div className="flex h-fit items-center space-x-4 text-sm">
        <NextAvatar src={image} alt="p" size={10} className="bg-transparent" />
        <Separator orientation="vertical" className="h-8" />

        {friend ? (
          <Button
            className="w-full gap-2"
            size="sm"
            variant="ghost"
            onClick={handleUnfriend}
          >
            Friend <UserCheck className="w-3 h-3" />
          </Button>
        ) : (
          <Button
            className="w-full"
            size="sm"
            variant="outline"
            onClick={handleAddFriend}
          >
            Add friend
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserCard;
