
import { safeFetch } from "./safe-fetch";

export async function getPlayer(name: string, tag: string) {
  return safeFetch(`https://api.henrikdev.xyz/valorant/v1/account/${name}/${tag}`);
}
