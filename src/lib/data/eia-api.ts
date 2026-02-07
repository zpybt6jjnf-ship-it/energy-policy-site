/**
 * EIA API v2 client for fetching live data.
 * Used via the server-side proxy at /api/eia to keep API keys hidden.
 */

import { EIA_API_BASE } from "../constants";

export interface EiaApiParams {
  route: string;
  frequency?: string;
  data?: string[];
  facets?: Record<string, string[]>;
  start?: string;
  end?: string;
  sort?: { column: string; direction: "asc" | "desc" }[];
  length?: number;
}

export interface EiaApiResponse {
  response: {
    total: number;
    data: Record<string, string | number>[];
  };
}

export async function fetchEiaData(
  params: EiaApiParams,
  apiKey: string
): Promise<EiaApiResponse> {
  const url = new URL(`${EIA_API_BASE}/${params.route}`);
  url.searchParams.set("api_key", apiKey);

  if (params.frequency) {
    url.searchParams.set("frequency", params.frequency);
  }

  if (params.data) {
    params.data.forEach((d) => url.searchParams.append("data[]", d));
  }

  if (params.facets) {
    Object.entries(params.facets).forEach(([key, values]) => {
      values.forEach((v) => url.searchParams.append(`facets[${key}][]`, v));
    });
  }

  if (params.start) url.searchParams.set("start", params.start);
  if (params.end) url.searchParams.set("end", params.end);
  if (params.length) url.searchParams.set("length", String(params.length));

  if (params.sort) {
    params.sort.forEach((s, i) => {
      url.searchParams.set(`sort[${i}][column]`, s.column);
      url.searchParams.set(`sort[${i}][direction]`, s.direction);
    });
  }

  const res = await fetch(url.toString(), {
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    throw new Error(`EIA API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
