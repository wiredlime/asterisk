type HeaderSectionProps = {
  header: string;
  subheader: string;
};

const HeaderSection = ({ header, subheader }: HeaderSectionProps) => {
  return (
    <div>
      <h5>{header}</h5>
      <p className="text-muted-foreground text-xs truncate max-w-60 md:max-w-none">
        {subheader}
      </p>
    </div>
  );
};

export default HeaderSection;
