export type ItemType = "albums" | "artists" | "songs";

export type CommandNavItem = {
  type: ItemType;
  name: string;
  image: string;
  metadata?: string;
  id: string;
};
