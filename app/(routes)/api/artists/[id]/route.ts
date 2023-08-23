import { NextRequest, NextResponse } from "next/server";
import { requestSpotify } from "../../helpers";

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const [artist, artistAlbums] = await Promise.all([
      requestSpotify(
        `/artists/${params.id}`,
        request.headers.get("authorization") || ""
      ),
      requestSpotify(
        `/artists/${params.id}/albums`,
        request.headers.get("authorization") || ""
      ),
    ]);

    return NextResponse.json({ ...artist, albums: artistAlbums.items });
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong in the GET /artists/id endpoint");
  }
};
