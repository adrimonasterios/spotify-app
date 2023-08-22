"use client";

import { useEffect, useState } from "react";
import { getSpotifyCode } from "./_utils/spotify";
import CommandNav from "./_components/CommandNav";
import { useDebounce } from "@/_utils/hooks";
import { titleCase } from "./_utils/helpers";
import { CommandNavItem } from "./_utils/types";
import { useSpotifyAuthentication } from "./_components/providers/SpotifyAuthenticationProvider";

const SUGGESTIONS_PER_CATEGORY = 5;

export default function Home() {
  const { token, refreshToken, expiresAt } = useSpotifyAuthentication();
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [query, setQuery] = useState<string>("");
  const [searchParams, setSearchParams] = useState<
    { refresh_token: string; access_token: string; expires_at: string } | {}
  >({});
  const { debouncedValue, loading } = useDebounce<string>(query, 500);

  useEffect(() => {
    if (debouncedValue) {
      handleFetchData(debouncedValue);
    }
  }, [debouncedValue]);

  const setCategoryItems = (items: any[]) => {
    return items.slice(0, SUGGESTIONS_PER_CATEGORY).map((item: any) => ({
      name: item.name,
      category: `${titleCase(item.type)}s`,
      image:
        item.type === "track"
          ? item.album?.images?.[0]?.url
          : item?.images?.[0]?.url,
      metadata: item.type === "artist" ? "" : item.artists[0].name,
    }));
  };

  const handleFetchData = async (debouncedValue: string) => {
    console.log({ token, refreshToken, expiresAt });
    const response = await fetch(
      `/api/suggestions?query=${debouncedValue}&${new URLSearchParams({
        token,
        refreshToken,
        expiresAt: expiresAt.toString(),
      }).toString()}`
    );
    const res = await response.json();

    console.log({ res });
    setSuggestions([
      ...(setCategoryItems(res.albums.items) || []),
      ...(setCategoryItems(res.artists.items) || []),
      ...(setCategoryItems(res.tracks.items) || []),
    ]);
  };

  const handleQueryUpdate = (value: string) => {
    setQuery(value);
    if (!value) setSuggestions([]);
  };

  const handleItemSelect = async (item: CommandNavItem) => {
    // const itemType:  =
    //   item.category.toLowerCase() as "albums" | "artists" | "songs";
    // const entireItem = suggestions[itemType as keyof {}].find((i: CommandNavItem) => i.id === item.id);
    // setItemDetails(entireItem)
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <CommandNav
        items={suggestions}
        onQueryUpdate={handleQueryUpdate}
        query={query}
        onOpen={() => console.log("open")}
        open={true}
        isHome
        loading={loading}
        onChange={handleItemSelect}
      />
    </main>
  );
}
