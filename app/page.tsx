"use client";

import { useEffect, useState } from "react";
import { SpotifyAuthentication } from "./_utils/spotify";
import CommandNav from "./_components/CommandNav";
import { useDebounce } from "@/_utils/hooks";

export default function Home() {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [query, setQuery] = useState<string>("");
  const { debouncedValue, loading } = useDebounce<string>(query, 500);

  useEffect(() => {
    (async () => {
      new SpotifyAuthentication();
    })();
  }, []);

  useEffect(() => {
    if (debouncedValue) {
      handleFetchData(debouncedValue);
    }
  }, [debouncedValue]);

  const handleFetchData = async (debouncedValue: string) => {
    let searchParams = new URLSearchParams({
      refresh_token: localStorage.getItem("refresh_token"),
      access_token: localStorage.getItem("access_token"),
      expires_at: localStorage.getItem("expires_at"),
    } as any);

    const response = await fetch(
      `/api/suggestions?query=${debouncedValue}&${searchParams.toString()}`
    );
    const res = await response.json();

    setSuggestions([
      ...(res.albums?.items?.slice(0, 5).map((album: any) => ({
        name: album.name,
        category: "Albums",
        image: album?.images?.[0]?.url,
        metadata: album.artists[0].name,
      })) || []),
      ...(res.artists?.items?.slice(0, 5).map((artist: any) => ({
        name: artist.name,
        image: artist?.images?.[0]?.url,
        category: "Artists",
      })) || []),
      ...(res.tracks?.items?.slice(0, 5).map((track: any) => ({
        name: track.name,
        image: track.album?.images?.[0]?.url,
        category: "Tracks",
        metadata: track.artists[0].name,
      })) || []),
    ]);
  };

  const handleQueryUpdate = (value: string) => {
    setQuery(value);
    if (!value) setSuggestions([]);
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
      />
    </main>
  );
}
