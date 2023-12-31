"use client";

import { useEffect, useState } from "react";
import CommandNav from "./_components/Home/CommandNav";
import { useDebounce, useSpotifySearch } from "@/_utils/hooks";
import { titleCase } from "./_utils/helpers";
import { CommandNavItem, ItemType, SlideOverItem } from "./_utils/types";
import SlideOver from "./_components/SlideOver/SlideOver";
import { useRouter } from "next/navigation";
import { useSlideOverItem } from "./_components/SlideOver/SlideOver.helpers";

const Home = () => {
  const router = useRouter();

  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<CommandNavItem[]>([]);
  const { fetchAlbum, fetchArtist, fetchTrack, itemDetails, clearItemDetails } =
    useSlideOverItem();
  const { debouncedValue, loading: debounceLoading } = useDebounce<string>(
    query,
    500
  );

  const { suggestions, updateSuggestions, fetchData, loading } =
    useSpotifySearch();

  useEffect(() => {
    if (debouncedValue) {
      fetchData(debouncedValue, ["album", "artist", "track"], 5, 0);
    }
  }, [debouncedValue]);

  useEffect(() => {
    if (Object.keys(suggestions).length) {
      setResults([
        ...(handleCategoryResults(suggestions.albums.items) || []),
        ...(handleCategoryResults(suggestions.artists.items) || []),
        ...(handleCategoryResults(suggestions.tracks.items) || []),
      ]);
    }
  }, [suggestions]);

  const handleCategoryResults = (items: any[]) => {
    return items.map((item: any) => ({
      id: item.id,
      name: item.name,
      type: item.type,
      category: `${titleCase(item.type)}s`,
      image:
        item.type === "track"
          ? item.album?.images?.[0]?.url
          : item?.images?.[0]?.url,
      metadata: item.type === "artist" ? "" : item.artists[0].name,
    }));
  };

  const handleQueryUpdate = (value: string) => {
    setQuery(value);
    if (!value) updateSuggestions([]);
  };

  const handleItemSelect = async (item: CommandNavItem) => {
    switch (item.type) {
      case "album":
        await fetchAlbum(item.id);
        break;
      case "artist":
        await fetchArtist(item.id);
        break;
      case "track":
        await fetchTrack(item.id);
        break;
      default:
        console.log("could not find type of item");
    }
  };

  const handleSlideClose = () => {
    clearItemDetails();
  };

  const handleMore = (type: string) => {
    router.push(`/results/${type}?query=${debouncedValue}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-front w-screen h-screen bg-white absolute top-0 left-0 flex justify-end items-end">
        <div className="w-[1000px] h-[1000px] absolute -top-72 -left-72 bg-primary-400 rounded-full" />
        <p className="z-front text-10xl text-secondary-400 font-bold">amg.</p>
        <CommandNav
          items={results}
          query={query}
          open={true}
          isHome
          loading={loading || debounceLoading}
          onQueryUpdate={handleQueryUpdate}
          onOpen={() => null}
          onChange={handleItemSelect}
          onMore={handleMore}
        />

        {!!itemDetails && (
          <SlideOver
            open={!!itemDetails}
            item={itemDetails as SlideOverItem}
            onClose={handleSlideClose}
          />
        )}
      </div>
    </main>
  );
};

export default Home;
