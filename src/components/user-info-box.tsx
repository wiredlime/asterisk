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
    <div className={cn("flex gap-3 w-full", className)} {...props}>
      <div className="flex-shrink-0">
        <NextAvatar src={image} alt="My profile image" size={10} />
      </div>
      <div>
        <p className="truncate text-sm font-semibold">{name}</p>
        <p className="max-w-sm text-xs text-muted-foreground truncate">
          {email}
        </p>
      </div>
    </div>
  );
};
