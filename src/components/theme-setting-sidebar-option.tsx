import React, { useContext } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Check, Settings2 } from "lucide-react";
import { GRADIENT_PALETTE } from "@/lib/utils";
import { Theme, ThemeContext } from "@/contexts/theme-provider";

type Props = {};

export default function ThemeSettingSidebarOption({}: Props) {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="ghost">
          <Settings2 className="h-5 w-5 shrink-0 text-secondary-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        sideOffset={10}
        side="top"
        className="bg-transparent translate-x-4 border-none shadow-none"
      >
        <DropdownMenuLabel asChild>
          <p className="text-card-foreground">Theme Settings</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="gap-2 bg-background flex justify-between items-center"
          onClick={() => setTheme(Theme.DARK)}
        >
          <div className="flex gap-2 items-center">
            <div className="w-4 h-4 bg-zinc-900 shadow-inner shadow-zinc-500 rounded-sm"></div>
            <span>Dark</span>
          </div>
          {theme === Theme.DARK && (
            <Check className="w-3 h-3 text-muted-foreground" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="gap-2 bg-background flex justify-between items-center"
          onClick={() => setTheme(Theme.ROOT)}
        >
          <div className="flex gap-2 items-center">
            <div className="w-4 h-4 bg-white border shadow-inner shadow-zinc-100 rounded-sm"></div>
            <span>Light</span>
          </div>
          {theme === Theme.ROOT && (
            <Check className="w-3 h-3 text-muted-foreground" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="gap-2 bg-background flex justify-between items-center"
          onClick={() => setTheme(Theme.MIDNIGHT)}
        >
          <div className="flex gap-2 items-center">
            <div className="w-4 h-4 bg-slate-800 shadow-inner shadow-slate-600 rounded-sm"></div>
            <span>Midnight</span>
          </div>
          {theme === Theme.MIDNIGHT && (
            <Check className="w-3 h-3 text-muted-foreground" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled
          className="gap-2 bg-background flex justify-between items-center"
        >
          <div className="flex gap-2 items-center">
            <div
              className="w-4 h-4 border rounded-sm"
              style={{ backgroundImage: GRADIENT_PALETTE[0] }}
            ></div>
            <span>
              Violence{" "}
              <span className="text-xs italic text-muted-foreground">
                (Coming soon)
              </span>
            </span>
          </div>
          {theme === Theme.GAY && (
            <Check className="w-3 h-3 text-muted-foreground" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
