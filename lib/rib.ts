
import { safeFetch } from "./safe-fetch";

export async function getTeams() {
  return safeFetch("https://api.rib.gg/v1/teams");
}
