"use client";

import { Fragment, useEffect, useState } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { SideMenu, SideMenuProps } from "./side-menu";
import { usePathname } from "next/navigation";

interface MobileChatLayoutProps extends SideMenuProps {}
export default function MobileChatLayout({
  friends,
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
        <Link
          href="/dashboard"
          className={buttonVariants({ variant: "ghost" })}
        >
          Logo button
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
                    <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                      <div className="px-4 sm:px-6">
                        <DialogTitle className="text-base font-semibold leading-6 text-gray-900">
                          Menu
                        </DialogTitle>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        {/* Your content */}
                        <SideMenu
                          friends={friends}
                          session={session}
                          unseenRequestCount={unseenRequestCount}
                        />
                      </div>
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
