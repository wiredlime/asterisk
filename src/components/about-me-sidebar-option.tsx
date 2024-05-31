import React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

type Props = {};

export default function AboutMeSidebarOption({}: Props) {
  return (
    <HoverCard>
      <HoverCardTrigger className="flex items-center">
        <p className="text-muted-foreground text-sm">About me</p>
      </HoverCardTrigger>
      <HoverCardContent className="translate-x-1/3">
        The React Framework – created and maintained by @vercel.
      </HoverCardContent>
    </HoverCard>
  );
}
