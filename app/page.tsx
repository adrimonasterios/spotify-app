"use client";

import { useEffect, useState } from "react";
import CommandNav from "./_components/CommandNav";
import {
  useDebounce,
  useFetchAlbum,
  useFetchArtist,
  useFetchTrack,
} from "@/_utils/hooks";
import { defaultImage, formatDuration, titleCase } from "./_utils/helpers";
import { CommandNavItem, ItemType, SlideOverItem } from "./_utils/types";
import { useSpotifyAuthentication } from "./_components/providers/SpotifyAuthenticationProvider";
import SlideOver from "./_components/SlideOver";
import SimpleTable from "./_components/common/SimpleTable";
import moment from "moment";

const SUGGESTIONS_PER_CATEGORY = 5;

const prepareSlideOverItem = (item: { [key: string]: any }) => {
  switch (item.type) {
    case "album": {
      return {
        image: item.images?.[0]?.url || defaultImage,
        name: item.name,
        subtitle: `Released: ${moment(item.release_date).format(
          "MMM Do, YYYY"
        )}`,
        customContent: (
          <SimpleTable
            items={item.tracks.items.map((track: { [key: string]: any }) => ({
              name: track.name,
              duration: formatDuration(track.duration_ms),
            }))}
            headers={[
              { field: "name", label: "Name" },
              { field: "duration", label: "Duration" },
            ]}
          />
        ),
        contentTitle: "Tracks",
      };
    }
    case "artist": {
      return {
        image: item.images?.[0]?.url || defaultImage,
        name: item.name,
        subtitle: ``,
        customContent: (
          <SimpleTable
            items={item.albums.map((album: { [key: string]: any }) => ({
              image: (
                <img
                  src={album.images?.[0]?.url || defaultImage}
                  alt="album-cover"
                  height={40}
                  width={40}
                />
              ),
              name: album.name,
            }))}
            headers={[
              { field: "image", label: "Cover" },
              { field: "name", label: "Name" },
            ]}
          />
        ),
        contentTitle: "Albums",
      };
    }
    case "track": {
      return {
        image: item.album.images?.[0]?.url || defaultImage,
        name: `Album: ${item.name}`,
        subtitle: `Released: ${moment(item.album.release_date).format(
          "MMM Do, YYYY"
        )}`,
        customContent: (
          <div>
            {item.name}
            <span className="text-gray-500">
              {" "}
              ({formatDuration(item.duration_ms)})
            </span>
          </div>
        ),
        contentTitle: "Track",
      };
    }
  }
};

export default function Home() {
  const { token, refreshToken, expiresAt } = useSpotifyAuthentication();
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [query, setQuery] = useState<string>("");
  const [itemDetails, setItemDetails] = useState<SlideOverItem | null>(null);
  const { debouncedValue, loading } = useDebounce<string>(query, 500);
  const { album, fetchAlbum } = useFetchAlbum();
  const { artist, fetchArtist } = useFetchArtist();
  const { track, fetchTrack } = useFetchTrack();

  useEffect(() => {
    if (debouncedValue) {
      handleFetchData(debouncedValue);
    }
  }, [debouncedValue]);

  useEffect(() => {
    setItemDetails(prepareSlideOverItem(album) as SlideOverItem);
  }, [album]);

  useEffect(() => {
    setItemDetails(prepareSlideOverItem(artist) as SlideOverItem);
  }, [artist]);

  useEffect(() => {
    setItemDetails(prepareSlideOverItem(track) as SlideOverItem);
  }, [track]);

  const setCategoryItems = (items: any[]) => {
    return items.slice(0, SUGGESTIONS_PER_CATEGORY).map((item: any) => ({
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

  const handleFetchData = async (debouncedValue: string) => {
    const response = await fetch(`/api/suggestions?query=${debouncedValue}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await response.json();
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
    setItemDetails(null);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <CommandNav
        items={suggestions}
        onQueryUpdate={handleQueryUpdate}
        query={query}
        onOpen={(value) => console.log(value)}
        open={true}
        isHome
        loading={loading}
        onChange={handleItemSelect}
      />

      {!!itemDetails && (
        <SlideOver
          open={!!itemDetails}
          onClose={handleSlideClose}
          item={itemDetails as SlideOverItem}
        />
      )}
    </main>
  );
}
