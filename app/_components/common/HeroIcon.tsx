import { FC } from "react";
import * as HIcons from "@heroicons/react/24/outline";
import * as SolidIcons from "@heroicons/react/20/solid";

const HeroIcon: FC<{
  icon: string;
  className?: string;
  onClick?: (e: MouseEvent) => void;
}> = (props) => {
  const { ...icons } = { ...HIcons, ...SolidIcons };
  // @ts-ignore
  const Icon: JSX.Element = icons[props.icon];

  return (
    <>
      {/* @ts-ignore */}
      <Icon {...props} aria-hidden="true" />
    </>
  );
};

export default HeroIcon;
