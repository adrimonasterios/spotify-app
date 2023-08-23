"use client";
import Heading from "@/_components/Heading";
import SlideOver from "@/_components/SlideOver/SlideOver";
import {
  prepareSlideOverItem,
  useSlideOverItem,
} from "@/_components/SlideOver/SlideOver.helpers";
import Button from "@/_components/common/Button";
import List from "@/_components/common/List";
import { useSpotifyAuthentication } from "@/_components/providers/SpotifyAuthenticationProvider";
import { formatAmount, formatDuration, titleCase } from "@/_utils/helpers";
import { useSpotifySearch } from "@/_utils/hooks";
import { SlideOverItem } from "@/_utils/types";
import moment from "moment";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Header = {
  label: string;
  value: string;
  srOnly?: boolean;
};

type Headers = {
  albums: Header[];
  artists: Header[];
  tracks: Header[];
};

const headers = {
  albums: [
    {
      label: "Name",
      value: "name",
    },
    {
      label: "Released",
      value: "release_date",
    },
    {
      label: "Artist",
      value: "artist",
    },
    {
      label: "View",
      value: "view",
      srOnly: true,
    },
  ],
  artists: [
    {
      label: "Name",
      value: "name",
    },
    {
      label: "#Followers",
      value: "followers",
    },
    {
      label: "View",
      value: "view",
      srOnly: true,
    },
  ],
  tracks: [
    {
      label: "Name",
      value: "name",
    },
    {
      label: "Album",
      value: "album",
    },
    {
      label: "Duration",
      value: "duration",
    },
    {
      label: "View",
      value: "view",
      srOnly: true,
    },
  ],
};

const Results = () => {
  const LIMIT = 10;
  const router = useRouter();
  const { type } = useParams();
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const [offset, setOffset] = useState<number>(0);
  const { suggestions, fetchData } = useSpotifySearch();
  const { fetchAlbum, fetchArtist, fetchTrack, itemDetails, clearItemDetails } =
    useSlideOverItem();

  useEffect(() => {
    console.log("OFFSET");
    (async () => {
      await fetchData(
        query as string,
        [type.slice(0, -1) as string],
        LIMIT,
        offset
      );
    })();
  }, [offset]);

  const items = useMemo(() => {
    if (!suggestions[type as string]) return [];
    return suggestions[type as string].items.map((suggestion: any) => {
      switch (type) {
        case "albums":
          return {
            name: suggestion.name,
            release_date: moment(suggestion.release_date).format(
              "MMM Do, YYYY"
            ),
            artist: suggestion.artists[0].name,
            view: (
              <Button
                onClick={async () => await fetchAlbum(suggestion.id)}
                text="View"
              />
            ),
          };
        case "artists":
          return {
            name: suggestion.name,
            followers: formatAmount(suggestion.followers?.total || 0),
            view: (
              <Button
                onClick={async () => await fetchArtist(suggestion.id)}
                text="View"
              />
            ),
          };
        case "tracks":
          return {
            album: suggestion.album.name,
            duration: formatDuration(suggestion.duration_ms),
            name: suggestion.name,
            view: (
              <Button
                onClick={async () => await fetchTrack(suggestion.id)}
                text="View"
              />
            ),
          };
      }
    });
  }, [type, suggestions]);

  const handlePageChange = (type: string) => {
    router.push(`/results/${type.toLowerCase()}?query=${query}`);
  };

  const handleSlideClose = () => {
    clearItemDetails();
  };

  const handlePagination = (page: number) => {
    setOffset((page - 1) * LIMIT);
  };

  return (
    <Heading
      subtitles={["Albums", "Artists", "Tracks"].map((type) => ({
        text: type,
        onClick: () => {
          handlePageChange(type);
        },
      }))}
    >
      {!!suggestions?.[type as string]?.total && (
        <List
          headers={headers[type as keyof Headers]}
          items={items}
          totalItems={suggestions?.[type as string]?.total || 0}
          title={titleCase(type as string)}
          description={`Results matching the query "${query}"`}
          itemsPerPage={LIMIT}
          onPageChange={handlePagination}
        />
      )}
      {!!itemDetails && (
        <SlideOver
          open={!!itemDetails}
          item={itemDetails as SlideOverItem}
          onClose={handleSlideClose}
        />
      )}
    </Heading>
  );
};
export default Results;
