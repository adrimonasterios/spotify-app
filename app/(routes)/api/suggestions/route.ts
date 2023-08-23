import { NextRequest, NextResponse } from "next/server";
import { requestSpotify } from "../helpers";
import { NextApiRequest } from "next";

export const GET = async function (request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query");

    const response = await requestSpotify(
      `/search?q=${query}&type=album%2Cartist%2Ctrack`,
      request.headers.get("authorization") || ""
    );
    return NextResponse.json(response);
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong in the GET /suggestions endpoint");
  }
};
