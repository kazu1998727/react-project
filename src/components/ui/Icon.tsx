import addSvg from "../../assets/img/icon/+.svg";
import cancelSvg from "../../assets/img/icon/cancel.svg";
import deleteSvg from "../../assets/img/icon/delete.svg";
import doneSvg from "../../assets/img/icon/done.svg";
import editSvg from "../../assets/img/icon/edit.svg";
import logoSvg from "../../assets/img/icon/logo.svg";
import saveSvg from "../../assets/img/icon/save.svg";

const icons = {
  add: addSvg,
  cancel: cancelSvg,
  delete: deleteSvg,
  done: doneSvg,
  edit: editSvg,
  logo: logoSvg,
  save: saveSvg,
} as const;

export type IconName = keyof typeof icons;

type Props = {
  name: IconName;
  size?: number;
  className?: string;
  alt?: string;
};

export default function Icon({ name, size = 24, className, alt = "" }: Props) {
  return (
    <img
      src={icons[name]}
      alt={alt}
      width={size}
      height={size}
      className={className}
    />
  );
}
