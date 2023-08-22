import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const redirectUri = "http://localhost:3000";

const getSpotifyToken = async () => {
  function generateRandomString(length: number) {
    let text = "";
    let possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  async function generateCodeChallenge(codeVerifier: string) {
    function base64encode(string: ArrayBuffer) {
      return btoa(
        String.fromCharCode.apply(null, new Uint8Array(string) as any)
      )
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await window.crypto.subtle.digest("SHA-256", data);

    return base64encode(digest);
  }

  const codeVerifier = generateRandomString(128);
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  let state = generateRandomString(16);
  let scope = "user-read-private user-read-email";

  localStorage.setItem("code_verifier", codeVerifier);

  let args = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope: scope,
    redirect_uri: redirectUri,
    state: state,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
  } as any);

  window.location = ("https://accounts.spotify.com/authorize?" + args) as
    | Location
    | (string & Location);
};

export const useSpotifyToken = () => {
  const searchParams = useSearchParams();

  const code = searchParams.get("code");
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const currentToken = localStorage?.getItem("access_token");
    if (currentToken) {
      setToken(currentToken);
    }
  }, []);

  useEffect(() => {
    (async () => {
      if (!!code && !token) {
        let codeVerifier = localStorage.getItem("code_verifier");

        let body = new URLSearchParams({
          grant_type: "authorization_code",
          code: code,
          redirect_uri: redirectUri,
          client_id: clientId,
          code_verifier: codeVerifier,
        } as any);

        fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: body,
        })
          .then(async (response) => {
            if (!response.ok) {
              throw new Error("HTTP status " + response.status);
            }
            const res = await response.json();
            console.log({ res });
            localStorage.setItem("access_token", res.access_token);
            setToken(res.access_token);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      } else if (!code && !token) {
        await getSpotifyToken();
      }
    })();
  }, [code, token]);

  return { token };
};
