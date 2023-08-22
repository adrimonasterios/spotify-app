import { NextRequest, NextResponse } from "next/server";

export const GET = async function () {
  try {
    console.log(process.env.CLIENT_ID);
    const suggestions = await fetch(
      `https://accounts.spotify.com/authorize?response_type=code&client_id=${process.env.CLIENT_ID}&redirect_uri=http://localhost:3000`
    );
    const html = await suggestions.text();
    return NextResponse.json({ spotifyLogin: `${html}` });
  } catch (error) {
    console.log(error);
  }
};
