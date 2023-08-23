export type ItemType = "album" | "artist" | "track";

export type CommandNavItem = {
  type: ItemType;
  name: string;
  image: string;
  metadata?: string;
  id: string;
};

export type SlideOverItem = {
  image: string;
  name: string;
  subtitle: string;
  customContent: JSX.Element;
  contentTitle: string;
};
