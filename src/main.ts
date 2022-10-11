import { getLocationMonsters, Item, itemDropsArray, Location, print, toMonster } from "kolmafia";
import { sinceKolmafiaRevision } from "libram";

/* Function to generate all fallbot-gettable drops in zones.  */ 
function zoneDrops(zoneWithDrops: string) {
  const zone = Location.get(zoneWithDrops);
  const badAttributes = ["LUCKY", "ULTRARARE", "BOSS"];

  // Weird map/filter from yellowray.ts in wanderers in garbo.
  const monstersInZone = Object.keys(getLocationMonsters(zone))
    .map((monster) => toMonster(monster))
    .filter((monster) => !badAttributes.some((s) => monster.attributes.includes(s)));

  const returnValues = new Map<Item, string>();

  if (monstersInZone.length === 0) {
    return returnValues;
  } else {
    for (const m of monstersInZone) {
      for (const i of itemDropsArray(m)) {
        if (["","n"].includes(i.type)) {
          returnValues.set(
            i.drop,
            `${m.name},${i.rate},${i.type}`
          )
        }
      }
    }
    return returnValues;
  }
}

export default function main(argString = ""): void {
  sinceKolmafiaRevision(26831);

  // argString is the provided string for KOL.
  const args = argString.split(" ");
  for (const arg of args) {
    if (arg.match(/zoneDrops/)) {
      const zone = argString.split("neDrops ")[1];
      print(`Checking items in ${zone}`);
      for (const d of zoneDrops(zone)) {
        console.log(`${d[0]},${d[1]}`);
      }
    }
  }

}
