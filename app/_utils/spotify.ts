const setLocalStorageValues = (data: {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}) => {
  const t = new Date().getTime() / 1000;
  const expires_at = t + data.expires_in;

  localStorage.setItem("access_token", data.access_token);
  localStorage.setItem("refresh_token", data.refresh_token);
  localStorage.setItem("expires_at", expires_at.toString());
};

export class SpotifyAuthentication {
  static possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  static scope = "user-read-private user-read-email";
  static clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  static redirectUri = "http://localhost:3000";
  static codeChallengeMethod = "S256";
  static grantType = "authorization_code";
  static responseType = "code";

  public token = "";

  constructor() {
    this.getToken();
  }

  private generateRandomString(length: number) {
    let text = "";
    for (let i = 0; i < length; i++) {
      text += SpotifyAuthentication.possible.charAt(
        Math.floor(Math.random() * SpotifyAuthentication.possible.length)
      );
    }
    return text;
  }

  private async generateCodeChallenge(codeVerifier: string) {
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

  private async getCode() {
    const codeVerifier = this.generateRandomString(128);
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);
    const state = this.generateRandomString(16);
    localStorage.setItem("code_verifier", codeVerifier);

    const args = new URLSearchParams({
      response_type: SpotifyAuthentication.responseType,
      client_id: SpotifyAuthentication.clientId,
      scope: SpotifyAuthentication.scope,
      redirect_uri: SpotifyAuthentication.redirectUri,
      state: state,
      code_challenge_method: SpotifyAuthentication.codeChallengeMethod,
      code_challenge: codeChallenge,
    } as any);

    window.location = ("https://accounts.spotify.com/authorize?" + args) as
      | Location
      | (string & Location);
  }

  private async getToken() {
    const urlParams = new URLSearchParams(window.location.search);
    let code = urlParams.get("code");
    const currentToken = localStorage?.getItem("access_token");
    let codeVerifier = localStorage.getItem("code_verifier");

    if (currentToken) {
      return;
    } else if (!code) {
      await this.getCode();
    }

    let body = new URLSearchParams({
      grant_type: SpotifyAuthentication.grantType,
      code,
      redirect_uri: SpotifyAuthentication.redirectUri,
      client_id: SpotifyAuthentication.clientId,
      code_verifier: codeVerifier,
    } as any);

    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body,
    });

    if (!response.ok) {
      throw new Error("HTTP status " + response.status);
    }
    const res = await response.json();

    setLocalStorageValues(res);

    this.token = res.access_token;
  }
}

const refreshToken = async (refreshToken: string) => {
  let body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
    refresh_token: refreshToken,
  } as any);

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body,
  });

  if (!response.ok) {
    throw new Error("HTTP status " + response.status);
  }
  const res = await response.json();
  setLocalStorageValues(res);
  return res.access_token;
};

export const requestSpotify = async (
  url: string,
  { refresh_token, access_token, expires_at }: { [k: string]: string }
) => {
  try {
    let token = access_token;
    const t = new Date().getTime() / 1000;

    if (!access_token && !refresh_token) {
      const spotify = new SpotifyAuthentication();
      token = spotify.token;
    } else if (Number(expires_at) - t <= 0 && refresh_token) {
      token = await refreshToken(refresh_token);
    }

    const response = await fetch(`https://api.spotify.com/v1${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return await response.json();
  } catch (error) {
    console.log({ error });
  }
};
