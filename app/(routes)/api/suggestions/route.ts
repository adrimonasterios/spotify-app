import { requestSpotify } from "@/_utils/spotify";
import { NextRequest, NextResponse } from "next/server";

export const GET = async function (request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query");
    const response = await requestSpotify(
      `/search?q=${query}&type=album%2Cartist%2Ctrack`,
      Object.fromEntries(searchParams)
    );
    return NextResponse.json(response);
  } catch (error) {
    console.log(error);
  }
};
