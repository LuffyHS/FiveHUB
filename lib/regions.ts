export type LeagueRegion = "americas" | "emea" | "pacific" | "china";

export const REGION_LABEL: Record<LeagueRegion, string> = {
  americas: "Americas",
  emea: "EMEA",
  pacific: "Pacific",
  china: "China",
};

// orlandomm API region codes (subset)
export const ORLANDOMM_REGION_CODES: Record<LeagueRegion, string[]> = {
  americas: ["na", "br", "lan", "las"],
  emea: ["eu"],
  pacific: ["ap", "kr", "jp", "oce"],
  china: ["ch"],
};

// vlrggapi region codes
export const VLRGGAPI_REGION_CODES: Record<LeagueRegion, string[]> = {
  americas: ["na", "br", "la", "la-n", "la-s"],
  emea: ["eu"],
  pacific: ["ap", "kr", "jp", "oce"],
  china: ["cn"],
};
