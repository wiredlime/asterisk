"use client";
import { Separator } from "./ui/separator";
import NextAvatar from "./ui/next-avatar";
import FriendActionButton from "./friend-action-button";

type UserCardProps = {
  isFriend: boolean;
  name: string;
  email: string;
  image: string;
};

const UserCard = ({ isFriend, name, email, image }: UserCardProps) => {
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
        <FriendActionButton isFriend={isFriend} friendEmail={email} />
      </div>
    </div>
  );
};

export default UserCard;
