import { NextRequest, NextResponse } from "next/server";
import { requestSpotify } from "../../helpers";

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const response = await requestSpotify(
      `/tracks/${params.id}`,
      request.headers.get("authorization") || ""
    );
    return NextResponse.json(response);
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong in the GET /tracks/id endpoint");
  }
};
