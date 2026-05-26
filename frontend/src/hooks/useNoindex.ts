import { useEffect } from "react";
import { setRobotsNoindex } from "../utils/meta";

export function useNoindex(): void {
  useEffect(() => setRobotsNoindex(), []);
}
