type Props = {
  copyright?: string;
  companyLabel?: string;
};

export default function Footer({
  copyright = "Copyright © 2021 Sample",
  companyLabel = "運営会社",
}: Props) {
  return (
    <div className="flex items-center justify-between gap-5 leading-[60px] h-[60px]">
      <p className="text-caption">{copyright}</p>
      <p className="text-caption">{companyLabel}</p>
    </div>
  );
}
