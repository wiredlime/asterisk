import React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "./ui/button";
import { Apple, Info } from "lucide-react";

type Props = {};

function AboutProjectSidebarOption({}: Props) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button size="sm" variant="ghost" className="hover:bg-transparent">
          <Info className="h-5 w-5 shrink-0 text-muted-foreground" />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="translate-x-1/3 max-w-xs">
        The React Framework – created and maintained by @vercel.
      </HoverCardContent>
    </HoverCard>
  );
}

export default AboutProjectSidebarOption;
