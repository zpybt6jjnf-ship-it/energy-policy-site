import { NextRequest, NextResponse } from "next/server";
import { fetchEiaData, type EiaApiParams } from "@/lib/data/eia-api";

const EIA_API_KEY = process.env.EIA_API_KEY || "";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const route = searchParams.get("route");

  if (!route) {
    return NextResponse.json(
      { error: "Missing required parameter: route" },
      { status: 400 }
    );
  }

  if (!EIA_API_KEY) {
    return NextResponse.json(
      { error: "EIA API key not configured" },
      { status: 500 }
    );
  }

  const params: EiaApiParams = {
    route,
    frequency: searchParams.get("frequency") || undefined,
    data: searchParams.getAll("data[]"),
    start: searchParams.get("start") || undefined,
    end: searchParams.get("end") || undefined,
    length: searchParams.get("length")
      ? Number(searchParams.get("length"))
      : undefined,
  };

  // Parse facets from query params
  const facets: Record<string, string[]> = {};
  searchParams.forEach((value, key) => {
    const facetMatch = key.match(/^facets\[(.+)\]\[\]$/);
    if (facetMatch) {
      const facetKey = facetMatch[1];
      if (!facets[facetKey]) facets[facetKey] = [];
      facets[facetKey].push(value);
    }
  });
  if (Object.keys(facets).length > 0) {
    params.facets = facets;
  }

  try {
    const data = await fetchEiaData(params, EIA_API_KEY);
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
