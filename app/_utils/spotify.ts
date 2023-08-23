"use client";

const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const redirectUri = "http://localhost:3000";

export const getSpotifyCode = async () => {
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
