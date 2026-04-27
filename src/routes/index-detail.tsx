import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/index-detail")({
  component: () => <Navigate to="/" />,
});
