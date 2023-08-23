import { ButtonHTMLAttributes, LegacyRef } from "react";
import { classNames } from "@/_utils/helpers";

const buttonVariants = {
  primary: "bg-primary-400  text-white  hover:bg-primary-500",
  ghost:
    "shadow-none bg-transparent text-gray-500  cursor-pointer hover:text-gray-700",
};

export type ButtonProps = Partial<ButtonHTMLAttributes<HTMLElement>> & {
  text: string | JSX.Element;
  onClick?: (e: MouseEvent) => void;
  variant?: "primary" | "ghost";
};

const Button = ({
  text,
  onClick,
  variant,
  className,
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={classNames(
        `inline-flex items-center rounded border border-transparent px-2.5 py-1.5 text-xs font-semibold justify-center focus:outline-none ${
          buttonVariants[variant || "primary"]
        }`,
        className
      )}
      onClick={disabled ? undefined : onClick}
      {...props}
    >
      {text}
    </button>
  );
};

export default Button;
