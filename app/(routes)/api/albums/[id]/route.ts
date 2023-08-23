import { NextRequest, NextResponse } from "next/server";
import { requestSpotify } from "../../helpers";
import { NextApiRequest } from "next";

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const response = await requestSpotify(
      `/albums/${params.id}`,
      request.headers.get("authorization") || ""
    );
    return NextResponse.json(response);
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong in the GET /albums/id endpoint");
  }
};
