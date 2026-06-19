export function getOAuthRedirectUrl(): string {
  if (typeof window === "undefined") {
    return "http://localhost:3000"
  }

  return (
    window.location.hostname === "aicomicfactory.app" ? "https://aicomicfactory.app"
    : window.location.hostname === "AtomCollide-智械工坊-summoner.hf.space" ? "https://AtomCollide-智械工坊-summoner.hf.space"
    : "http://localhost:3000"
  )
}