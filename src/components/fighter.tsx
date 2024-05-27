import { Dot } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type FighterProps = {
  image: string;
  name: string;
  bio?: string;
  onClick?: VoidFunction;
};

const Fighter = ({ image, name, bio, onClick }: FighterProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectFighter = async () => {
    setIsLoading(true);
    onClick?.();
  };
  return (
    <div
      className="group space-y-4 grid place-items-center"
      onClick={handleSelectFighter}
    >
      {isLoading ? (
        <div className="bg-accent/25 w-[180px] h-[180px] rounded-full flex items-center justify-center pt-8">
          <Dot className="animate-bounce w-10 h-20 text-muted-foreground/50 text-lg " />
          <Dot className="animate-bounce duration-500 w-10 h-20 text-muted-foreground/50 -ml-5" />
          <Dot className="animate-bounce w-10 h-20 text-muted-foreground/50 -ml-5" />
        </div>
      ) : (
        <>
          <div className="bg-accent/20 rounded-full">
            <Image
              referrerPolicy="no-referrer"
              width={180}
              height={180}
              src={image}
              alt={`${name} profile`}
              className="group-hover:cursor-pointer group-hover:scale-110 duration-150"
            />
          </div>
          <div className="grid place-items-center group-hover:mt-6">
            <p className="text-sm font-medium">{name}</p>
            <p className="text-xs text-muted-foreground">{bio}</p>
          </div>
        </>
      )}
    </div>
  );
};
export default Fighter;
