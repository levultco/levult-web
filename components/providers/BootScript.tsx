"use client";

import { useServerInsertedHTML } from "next/navigation";

/**
 * Puts an inline script in the server's HTML, and nowhere else. A <script> in
 * the React tree warns whenever the layout renders on the client (Fast Refresh,
 * or a client navigation), because React never runs scripts it renders itself.
 */
export function BootScript({ code }: { code: string }) {
  useServerInsertedHTML(() => <script dangerouslySetInnerHTML={{ __html: code }} />);
  return null;
}
