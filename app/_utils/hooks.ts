"use client";
import { useSpotifyAuthentication } from "@/_components/providers/SpotifyAuthenticationProvider";
import { useEffect, useState } from "react";

export function useDebounce<T>(
  value: T,
  delay?: number
): { debouncedValue: T; loading: boolean } {
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
}

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
