import { cn } from "@/lib/utils";
import Image, { ImageProps } from "next/image";
import React from "react";

interface NextAvatarProps extends ImageProps {
  size?: number;
}

export default function NextAvatar({
  src,
  alt = "Avatar",
  className,
  size = 9,
  ...props
}: NextAvatarProps) {
  return (
    <div
      className={cn(
        "relative bg-muted-foreground/10 rounded-full",
        `w-${size}`,
        `h-${size}`,

        className
      )}
    >
      <Image
        src={src}
        referrerPolicy="no-referrer"
        fill
        className={cn("rounded-full", className)}
        alt={alt}
        {...props}
      />
    </div>
  );
}
