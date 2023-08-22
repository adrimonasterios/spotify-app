import { Fragment, useEffect, useRef, useState } from "react";
import { Combobox, Dialog, Transition } from "@headlessui/react";
import { classNames } from "@/_utils/helpers";
import HeroIcon from "@@/common/HeroIcon";
import Image from "next/image";

type Item = {
  category: "Albums" | "Artists" | "Tracks";
  name: string;
  image: string;
  metadata?: string;
};

type Props = {
  items: Item[];
  open: boolean;
  onOpen: (value: boolean) => void;
  query: string;
  loading: boolean;
  isHome?: boolean;
  onQueryUpdate: (value: string) => void;
};

const PlaceholderBase = ({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) => {
  return (
    <div className="border-t border-gray-100 px-6 py-14 text-center text-sm sm:px-14">
      <HeroIcon icon={icon} className="mx-auto h-6 w-6 text-gray-400" />
      <p className="mt-4 font-semibold text-amg-secondary-400">{title}</p>
      <p className="mt-2 text-gray-500">{description}</p>
    </div>
  );
};

const Placeholder = ({
  loading,
  query,
  items,
}: {
  loading: boolean;
  query: string;
  items: Item[];
}) => {
  if (items.length) return null;
  if (loading) {
    return (
      <PlaceholderBase
        icon="InformationCircleIcon"
        title="Loading"
        description="We are looking for suggestions for you"
      />
    );
  } else if (query !== "" && !items.length) {
    return (
      <PlaceholderBase
        icon="FaceFrownIcon"
        title="No results found"
        description="We couldn’t find anything with that term. Please try
    again."
      />
    );
  } else {
    <PlaceholderBase
      icon="MagnifyingGlassIcon"
      title="Search for albums, artists and tracks"
      description="Start typing to get suggestions"
    />;
  }
};

const CommandNav = ({
  isHome,
  open,
  onOpen,
  items,
  query,
  loading,
  onQueryUpdate,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && isHome) inputRef.current.focus();
  }, [isHome]);

  const groups = items?.length
    ? items.reduce((groups: any, item: any) => {
        return {
          ...groups,
          [item.category]: [...((groups[item.category] as any) || []), item],
        };
      }, {})
    : [];

  const handleSeach = (event: React.ChangeEvent<HTMLInputElement>) => {
    onQueryUpdate(event.target.value);
  };

  const handlePressEnter = (e: React.KeyboardEvent) => {
    // if (query && e.key === "Enter") {
    //   navigate(filteredItems[0].url);
    // }
  };

  return (
    <Transition.Root
      show={open}
      as={Fragment}
      afterLeave={() => onQueryUpdate("")}
      appear
    >
      <Dialog as="div" className="relative z-front" onClose={onOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className={classNames(
              "fixed inset-0 transition-opacity",
              isHome ? "" : "bg-gray-500 bg-opacity-25"
            )}
          />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto max-w-xl transform overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-amg-secondary-400 ring-opacity-5 transition-all">
              <Combobox onChange={(item: any) => console.log(item)}>
                <div className="relative">
                  <HeroIcon
                    icon="MagnifyingGlassIcon"
                    className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                  />
                  <Combobox.Input
                    className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                    placeholder="Search..."
                    onChange={handleSeach}
                    onKeyDown={handlePressEnter}
                    ref={inputRef}
                  />
                </div>

                <Combobox.Options
                  static
                  className="max-h-80 scroll-pb-2 scroll-pt-11 space-y-2 overflow-y-auto pb-2"
                >
                  {!!Object.entries(groups).length &&
                    Object.entries(groups).map(([category, items]) => (
                      <li key={category}>
                        <h2 className="bg-gray-100 px-4 py-2.5 text-xs font-semibold text-gray-900">
                          {category}
                        </h2>
                        <ul className="mt-2 text-sm text-gray-800">
                          {(items as any).map((item: any, idx: number) => (
                            <Combobox.Option
                              key={`item-${idx}`}
                              value={item}
                              className={({ active }) =>
                                classNames(
                                  "flex cursor-pointer select-none rounded-xl p-3",
                                  active && "bg-gray-100"
                                )
                              }
                            >
                              {({ active }) => (
                                <>
                                  <div
                                    className={classNames(
                                      "flex h-10 w-10 flex-none items-center justify-center rounded-lg",
                                      item.color
                                    )}
                                  >
                                    <Image
                                      src={item.image}
                                      alt="item image"
                                      width={24}
                                      height={24}
                                    />
                                  </div>
                                  <div className="ml-4 flex-auto">
                                    <p
                                      className={classNames(
                                        "text-sm font-medium",
                                        active
                                          ? "text-gray-900"
                                          : "text-gray-700"
                                      )}
                                    >
                                      {item.name}
                                    </p>
                                    {!!item.metadata && (
                                      <p
                                        className={classNames(
                                          "text-sm",
                                          active
                                            ? "text-gray-500"
                                            : "text-gray-300"
                                        )}
                                      >
                                        {" "}
                                        ({item.metadata})
                                      </p>
                                    )}
                                  </div>
                                </>
                              )}
                            </Combobox.Option>
                          ))}
                        </ul>
                      </li>
                    ))}
                </Combobox.Options>
                <Placeholder query={query} loading={loading} items={items} />
              </Combobox>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default CommandNav;
