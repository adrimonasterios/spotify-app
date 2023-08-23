import { defaultImage, formatDuration } from "@/_utils/helpers";
import moment from "moment";
import SimpleTable from "../common/SimpleTable";
import { useFetchAlbum, useFetchArtist, useFetchTrack } from "@/_utils/hooks";
import { useEffect, useState } from "react";
import { SlideOverItem } from "@/_utils/types";

export const useSlideOverItem = () => {
  const { album, fetchAlbum } = useFetchAlbum();
  const { artist, fetchArtist } = useFetchArtist();
  const { track, fetchTrack } = useFetchTrack();
  const [itemDetails, setItemDetails] = useState<SlideOverItem | null>(null);

  useEffect(() => {
    setItemDetails(prepareSlideOverItem(album) as SlideOverItem);
  }, [album]);

  useEffect(() => {
    setItemDetails(prepareSlideOverItem(artist) as SlideOverItem);
  }, [artist]);

  useEffect(() => {
    setItemDetails(prepareSlideOverItem(track) as SlideOverItem);
  }, [track]);

  const clearItemDetails = () => setItemDetails(null);

  return { fetchAlbum, fetchArtist, fetchTrack, itemDetails, clearItemDetails };
};

export const prepareSlideOverItem = (item: { [key: string]: any }) => {
  switch (item.type) {
    case "album": {
      return {
        image: item.images?.[0]?.url || defaultImage,
        name: item.name,
        subtitle: `Released: ${moment(item.release_date).format(
          "MMM Do, YYYY"
        )}`,
        customContent: (
          <SimpleTable
            items={item.tracks.items.map((track: { [key: string]: any }) => ({
              name: track.name,
              duration: formatDuration(track.duration_ms),
            }))}
            headers={[
              { field: "name", label: "Name" },
              { field: "duration", label: "Duration" },
            ]}
          />
        ),
        contentTitle: "Tracks",
      };
    }
    case "artist": {
      return {
        image: item.images?.[0]?.url || defaultImage,
        name: item.name,
        subtitle: ``,
        customContent: (
          <SimpleTable
            items={item.albums.map((album: { [key: string]: any }) => ({
              image: (
                <img
                  src={album.images?.[0]?.url || defaultImage}
                  alt="album-cover"
                  height={40}
                  width={40}
                />
              ),
              name: album.name,
            }))}
            headers={[
              { field: "image", label: "Cover" },
              { field: "name", label: "Name" },
            ]}
          />
        ),
        contentTitle: "Albums",
      };
    }
    case "track": {
      return {
        image: item.album.images?.[0]?.url || defaultImage,
        name: `Album: ${item.name}`,
        subtitle: `Released: ${moment(item.album.release_date).format(
          "MMM Do, YYYY"
        )}`,
        customContent: (
          <div>
            {item.name}
            <span className="text-gray-500">
              {" "}
              ({formatDuration(item.duration_ms)})
            </span>
          </div>
        ),
        contentTitle: "Track",
      };
    }
  }
};
