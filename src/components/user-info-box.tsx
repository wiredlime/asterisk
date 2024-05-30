import { HTMLAttributes } from "react";
import NextAvatar from "./ui/next-avatar";
import { cn } from "@/lib/utils";

interface UserInfoBoxProps extends HTMLAttributes<HTMLDivElement> {
  image: string;
  name: string;
  email?: string;
}

export const UserInfoBox = ({
  image,
  name,
  email,
  className,
  ...props
}: UserInfoBoxProps) => {
  return (
    <div className={cn("w-full flex gap-3", className)} {...props}>
      <NextAvatar
        src={image}
        alt="My profile image"
        size={10}
        className="shrink-0"
      />
      <div className="w-full">
        <p className="truncate text-sm font-semibold">{name}</p>
        <p className="text-xs text-muted-foreground truncate">{email}</p>
      </div>
    </div>
  );
};
