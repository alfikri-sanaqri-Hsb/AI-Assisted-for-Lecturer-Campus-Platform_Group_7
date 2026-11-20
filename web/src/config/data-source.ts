export type DataSourceMode = "mock" | "api";

export const DATA_SOURCE_MODE: DataSourceMode =
  process.env.NEXT_PUBLIC_USE_API === "true" ? "api" : "mock";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export const IS_MOCK_MODE = DATA_SOURCE_MODE === "mock";
