import Ephemeris from "ephemeris";
import { ephemToHebrew } from "@/utils/astro-he";

export function getEphemeris(dateISO, lat, lon, height = 0) {
  const date = new Date(dateISO);
  const ephem = Ephemeris.getAllPlanets(date, lon, lat, height); // lon ואז lat
  return ephemToHebrew(ephem);
}