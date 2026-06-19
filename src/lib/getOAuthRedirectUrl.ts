export function getOAuthRedirectUrl(): string {
  if (typeof window === "undefined") {
    return "http://localhost:3000"
  }

  return (
    window.location.hostname === "summoner.atomcollide.com" ? "https://summoner.atomcollide.com"
    : window.location.hostname === "AtomCollide-summoner.hf.space" ? "https://AtomCollide-summoner.hf.space"
    : "http://localhost:3000"
  )
}