"use client";
import { useSpotifyAuthentication } from "@/_components/providers/SpotifyAuthenticationProvider";
import { useEffect, useState } from "react";
import { titleCase } from "./helpers";

export const useDebounce = <T>(
  value: T,
  delay?: number
): { debouncedValue: T; loading: boolean } => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
      setDebouncedValue(value);
    }, delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return { debouncedValue, loading };
};

export const useSpotifySearch = () => {
  const SUGGESTIONS_PER_CATEGORY = 5;
  const { token } = useSpotifyAuthentication();
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

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

  const fetchData = async (debouncedValue: string) => {
    setLoading(true);
    const response = await fetch(`/api/suggestions?query=${debouncedValue}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await response.json();
    setSuggestions([
      ...(setCategoryItems(res.albums.items) || []),
      ...(setCategoryItems(res.artists.items) || []),
      ...(setCategoryItems(res.tracks.items) || []),
    ]);
    setLoading(false);
  };

  const updateSuggestions = (value: any[]) => {
    setSuggestions(value);
  };

  return { suggestions, updateSuggestions, fetchData, loading };
};

export const useFetchAlbum = () => {
  const { token } = useSpotifyAuthentication();
  const [album, setAlbum] = useState<{ [key: string]: any }>({});

  const fetchAlbum = async (id: string) => {
    const response = await fetch(`/api/albums/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await response.json();
    setAlbum(res);
  };

  return { album, fetchAlbum };
};

export const useFetchArtist = () => {
  const { token } = useSpotifyAuthentication();
  const [artist, setArtist] = useState<{ [key: string]: any }>({});

  const fetchArtist = async (id: string) => {
    const response = await fetch(`/api/artists/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await response.json();
    setArtist(res);
  };

  return { artist, fetchArtist };
};

export const useFetchTrack = () => {
  const { token } = useSpotifyAuthentication();
  const [track, setTrack] = useState<{ [key: string]: any }>({});

  const fetchTrack = async (id: string) => {
    const response = await fetch(`/api/tracks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await response.json();
    setTrack(res);
  };

  return { track, fetchTrack };
};
