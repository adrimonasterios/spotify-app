"use client";
import { getSpotifyCode } from "@/_utils/spotify";
import { useRouter, useSearchParams } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const SpotifyAuthenticationContext = createContext<{
  token: string;
  refreshToken: string;
  expiresAt: number;
}>({ token: "", refreshToken: "", expiresAt: 0 });

export const SpotifyAuthenticationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const router = useRouter();
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const redirectUri = "http://localhost:3000";

  const [token, setToken] = useState<string>("");
  const [refreshToken, setRefreshToken] = useState<string>("");
  const [expiresAt, setExpiresAt] = useState<number>(0);
  const [expiredToken, setExpiredToken] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  useEffect(() => {
    setToken(localStorage.getItem("access_token") || "");
    setRefreshToken(localStorage.getItem("refresh_token") || "");
    setExpiresAt(Number(localStorage.getItem("expires_at") || 0));
    if (
      Math.max(expiresAt, Number(localStorage.getItem("expires_at"))) -
        Math.floor(new Date().getTime() / 1000) <=
      0
    ) {
      setExpiredToken(true);
    }
  }, []);

  useEffect(() => {
    //Set Token with code url param after authenticating with Spotify
    (async () => {
      const currentToken = localStorage.getItem("access_token");
      if (!currentToken) {
        if (code) {
          let codeVerifier = localStorage.getItem("code_verifier");

          let body = new URLSearchParams({
            grant_type: "authorization_code",
            code: code,
            redirect_uri: redirectUri,
            client_id: clientId,
            code_verifier: codeVerifier,
          } as any);

          const response = await fetch(
            "https://accounts.spotify.com/api/token",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: body,
            }
          );
          if (!response.ok) {
            throw new Error("HTTP status " + response.status);
          }
          const res = await response.json();

          setAuthenticationValues(res);
        } else {
          await getSpotifyCode();
        }
      }
    })();
  }, [code, token]);

  useEffect(() => {
    //Refresh token when it expires
    if (token && expiredToken) {
      (async () => {
        try {
          let body = new URLSearchParams({
            grant_type: "refresh_token",
            client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
            refresh_token: refreshToken,
          } as any);

          const response = await fetch(
            "https://accounts.spotify.com/api/token",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: body,
            }
          );

          const res = await response.json();

          if (!response.ok) {
            if (res.error_description === "Refresh token revoked") {
              localStorage.clear();
              router.push("/");
            } else {
              throw new Error("HTTP status " + response.status);
            }
          }

          setAuthenticationValues(res);
          return res.access_token;
        } catch (error) {
          console.log({ error });
        }
      })();
    }
  }, [expiredToken]);

  function setAuthenticationValues(data: {
    expires_in: string;
    access_token: string;
    refresh_token: string;
  }) {
    const t = Math.floor(new Date().getTime() / 1000);
    const expires_at = t + data.expires_in;

    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
    localStorage.setItem("expires_at", expires_at);

    setToken(data.access_token);
    setRefreshToken(data.refresh_token);
    setExpiresAt(Number(expires_at));
  }

  return (
    <SpotifyAuthenticationContext.Provider
      value={{
        token: token || localStorage?.getItem("access_token") || "",
        refreshToken,
        expiresAt,
      }}
    >
      {children}
    </SpotifyAuthenticationContext.Provider>
  );
};

export const useSpotifyAuthentication = () => {
  const { token, refreshToken, expiresAt } = useContext(
    SpotifyAuthenticationContext
  );
  return { token, refreshToken, expiresAt };
};
