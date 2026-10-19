/**
 * While the intro or the page curtain covers the screen, entrances wait.
 * Both signal the moment they start to open with this event.
 */
export const REVEAL_EVENT = "levult:reveal";

export function isCovered() {
  const root = document.documentElement;
  return root.classList.contains("intro") || root.classList.contains("curtain");
}

/** Runs `cb` now, or as soon as whatever covers the page starts to open. */
export function onReveal(cb: () => void): () => void {
  if (!isCovered()) {
    cb();
    return () => {};
  }
  const handler = () => cb();
  window.addEventListener(REVEAL_EVENT, handler, { once: true });
  return () => window.removeEventListener(REVEAL_EVENT, handler);
}

export function announceReveal() {
  window.dispatchEvent(new Event(REVEAL_EVENT));
}
