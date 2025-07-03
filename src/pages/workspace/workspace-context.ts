import { createContext } from "react";
import type { WorkspaceContextProps } from "./workspace-provider";

export const workspaceContext = createContext<WorkspaceContextProps | undefined>(
  undefined
);
