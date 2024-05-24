"use client";
import { Plus } from "lucide-react";
import Image from "next/image";

type AddImageFormProps = {
  onNext?: ({ image }: { image: string }) => void;
};

const indices = Array.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
const imageOptions = indices.map((option) => `/avatar/avatar-${option}.svg`);

export function AddImageForm({ onNext }: AddImageFormProps) {
  function handleSelect(image: string) {
    // Pass img outward to the sign-up-stepper
    onNext?.({ image });
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground ml-2">
        Last step, select your profile image
      </p>

      <div className="flex flex-wrap">
        {imageOptions.map((image, index) => (
          <div
            className="group relative hover:cursor-pointer"
            key={image}
            onClick={() => handleSelect(image)}
          >
            <Image
              referrerPolicy="no-referrer"
              width={80}
              height={80}
              src={image}
              alt={`Profile image option ${index}`}
              className="hover:cursor-pointer hover:scale-110 duration-150"
            />
            <div className="hidden group-hover:grid absolute top-0 -left-2 w-24 h-24 bg-accent/40 rounded-full  place-items-center">
              <Plus className="opacity-70 text-background" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
