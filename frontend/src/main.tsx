import { ViteReactSSG } from "vite-react-ssg";
import { routes } from "./routing/routes";
import "./index.css";

export const createRoot = ViteReactSSG({ routes });
