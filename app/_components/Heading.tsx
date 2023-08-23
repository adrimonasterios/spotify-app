"use client";
import React, { PropsWithChildren, useEffect, useState } from "react";
import Button, { ButtonProps } from "@@/common/Button";
import HeroIcon from "@@/common/HeroIcon";
import { useParams, useRouter } from "next/navigation";

type HeadingProps = {
  subtitles?: ButtonProps[];
};

const Heading = ({ children, subtitles }: HeadingProps & PropsWithChildren) => {
  const router = useRouter();
  const { type } = useParams();
  const [selected, setSelected] = useState<number>(0);

  useEffect(() => {
    const selectedIndex =
      subtitles?.findIndex((s) => (s.text as string)?.toLowerCase() === type) ||
      0;

    setSelected(selectedIndex);
  }, [subtitles]);

  return (
    <div>
      <div className="bg-secondary-400 shadow-sm">
        <div className="flex flex-wrap items-center gap-6 mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 bg-secondary-400">
          <span className="flex items-center">
            <HeroIcon
              icon="HomeIcon"
              className="h-6 w-6 text-white mr-8 cursor-pointer"
              onClick={() => router.push("/")}
            />
            <h1 className="text-base font-semibold leading-7 text-white">
              Results
            </h1>
          </span>
          {!!subtitles && (
            <div className="order-last flex w-full gap-x-8 text-sm font-semibold leading-6 sm:order-none sm:w-auto sm:border-l sm:border-gray-200 sm:pl-6 sm:leading-7">
              {subtitles.map((s, i) => (
                <Button
                  onClick={
                    ((e: MouseEvent) => {
                      setSelected(i);
                      s.onClick?.(e);
                    }) as
                      | (React.MouseEventHandler<HTMLElement> &
                          ((e: MouseEvent) => void))
                      | undefined
                  }
                  text={s.text}
                  className={`${
                    selected === i
                      ? "text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                  variant="ghost"
                  key={`subtitile-${i}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-center w-full py-10 lg:px-20 px-8">
        {children}
      </div>
    </div>
  );
};

export default Heading;
