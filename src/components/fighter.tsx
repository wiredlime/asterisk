import Image from "next/image";

type FighterProps = {
  image: string;
  name: string;
  bio?: string;
  onClick?: VoidFunction;
};

const Fighter = ({ image, name, bio, onClick }: FighterProps) => {
  const handleSelectFighter = async () => {
    onClick?.();
  };
  return (
    <div
      className="group space-y-4 grid place-items-center"
      onClick={handleSelectFighter}
    >
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
    </div>
  );
};
export default Fighter;
