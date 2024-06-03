"use client";

import { Fragment, useEffect, useState } from "react";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Asterisk, Menu, Send, X } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { SideMenu, SideMenuProps } from "./side-menu";
import { usePathname } from "next/navigation";

interface MobileChatLayoutProps extends SideMenuProps {}
export default function MobileChatLayout({
  session,
  unseenRequestCount,
}: MobileChatLayoutProps) {
  const [open, setOpen] = useState(false);

  // Listen to pathname changes to close the side menu
  const pathname = usePathname();
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="fixed w-full bg-zinc-50 border-b border-zinc-200 top-0 inset-z-0 py-3 px-4">
      <div className="w-full flex justify-between items-center">
        <Link href="/dashboard" className="flex gap-2">
          <Send className="h-10 " />
          <Asterisk className="h-10 " />
        </Link>
        <Button onClick={() => setOpen(true)} className="space-x-4">
          <Menu className="w-6 h-6" />
        </Button>
      </div>
      <Transition show={open} as={Fragment}>
        <Dialog className="relative z-10" onClose={setOpen}>
          <TransitionChild
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
                <TransitionChild
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="-translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="-translate-x-full"
                >
                  <DialogPanel className="pointer-events-auto relative w-screen max-w-md">
                    <TransitionChild
                      as={Fragment}
                      enter="ease-in-out duration-500"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in-out duration-500"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="absolute right-0 top-0 -ml-8 flex pr-4 pt-4 sm:-ml-10">
                        <button
                          type="button"
                          className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                          onClick={() => setOpen(false)}
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Close panel</span>
                          <X className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </TransitionChild>
                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                      <SideMenu
                        session={session}
                        unseenRequestCount={unseenRequestCount}
                      />
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
