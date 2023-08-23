import { NextRequest, NextResponse } from "next/server";
import { requestSpotify } from "../helpers";

export const GET = async function (request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query");
    const type = searchParams.get("type");
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");

    const response = await requestSpotify(
      `/search?q=${query}&type=${type}&limit=${limit}&offset=${offset}`,
      request.headers.get("authorization") || ""
    );
    return NextResponse.json(response);
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong in the GET /suggestions endpoint");
  }
};
