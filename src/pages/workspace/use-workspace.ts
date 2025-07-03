import { useContext } from "react";
import { workspaceContext } from "./workspace-context";

export function useWorkspace() {
  const ctx = useContext(workspaceContext);
  if (!ctx)
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  return ctx;
}
