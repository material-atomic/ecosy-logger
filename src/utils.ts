export const getHostname = () => typeof window !== "undefined" ? window.location.hostname : (require("os").hostname?.() || "localhost");
export const parseArgs = (args: any[]) => {
  const summary = typeof args[0] === "string" ? args[0] : JSON.stringify(args[0]);
  return { summary, full: args.length > 1 ? JSON.stringify(args) : summary };
};
