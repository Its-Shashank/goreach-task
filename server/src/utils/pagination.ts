export const DEFAULT_PAGE_LIMIT = 8;
export const MAX_PAGE_LIMIT = 20;

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

function parsePositiveInt(value: unknown, fallback: number): number {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function getPaginationParams(query: {
  page?: unknown;
  limit?: unknown;
}): PaginationParams {
  const page = parsePositiveInt(query.page, 1);
  const limit = Math.min(
    MAX_PAGE_LIMIT,
    parsePositiveInt(query.limit, DEFAULT_PAGE_LIMIT),
  );

  return { page, limit };
}

export function paginateSlice<T>(
  items: T[],
  page: number,
  limit: number,
): { items: T[]; pagination: PaginationMeta } {
  const total = items.length;
  const start = (page - 1) * limit;
  const slice = items.slice(start, start + limit);

  return {
    items: slice,
    pagination: {
      page,
      limit,
      total,
      hasMore: start + slice.length < total,
    },
  };
}
