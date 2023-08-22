"use client";

import { useCallback, useEffect, useState } from "react";
import { useSpotifyToken } from "./_utils/spotify";

export default function Home() {
  const { token } = useSpotifyToken();
  console.log({ token });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>Root</div>
    </main>
  );
}
