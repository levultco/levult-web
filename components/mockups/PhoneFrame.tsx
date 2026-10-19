import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  label: string;
  className?: string;
  screenClassName?: string;
  /** Colour of the home indicator, to sit on the screen's own ground. */
  indicator?: "light" | "dark";
};

/**
 * A titanium phone shell for real, working interface fragments.
 * Screen content is laid out at the device's own scale (300px ≈ 390pt).
 */
export function PhoneFrame({ children, label, className = "", screenClassName = "", indicator = "light" }: Props) {
  return (
    <div
      data-ui
      role="group"
      aria-label={label}
      className={`relative aspect-[9/19.4] w-full max-w-[320px] rounded-[52px] bg-[#0b0b0c] p-[9px] ring-[1.5px] ring-[#8b8780] ${className}`}
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", var(--font-geist), sans-serif' }}
    >
      {/* side buttons */}
      <span aria-hidden="true" className="absolute -left-[3px] top-[19%] h-[7%] w-[3px] rounded-l bg-[#8b8780]" />
      <span aria-hidden="true" className="absolute -left-[3px] top-[28%] h-[7%] w-[3px] rounded-l bg-[#8b8780]" />
      <span aria-hidden="true" className="absolute -right-[3px] top-[24%] h-[11%] w-[3px] rounded-r bg-[#8b8780]" />

      <div className={`relative h-full w-full overflow-hidden rounded-[43px] ${screenClassName}`}>
        <div aria-hidden="true" className="absolute left-1/2 top-[11px] z-40 h-[25px] w-[86px] -translate-x-1/2 rounded-full bg-black" />
        {children}
        <div
          aria-hidden="true"
          className={`absolute bottom-[7px] left-1/2 z-40 h-[4px] w-[104px] -translate-x-1/2 rounded-full ${
            indicator === "light" ? "bg-white" : "bg-black"
          }`}
        />
      </div>
    </div>
  );
}

export function StatusBar({ tone = "light", time = "9:41" }: { tone?: "light" | "dark"; time?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`relative z-30 flex h-[46px] items-center justify-between px-[26px] pt-[3px] text-[14px] font-semibold tracking-[-0.01em] ${
        tone === "light" ? "text-white" : "text-[#111]"
      }`}
    >
      <span className="w-[54px] text-center">{time}</span>
      <span className="flex items-center gap-[5px]">
        <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor"><rect x="0" y="7.5" width="3" height="3.5" rx="0.8"/><rect x="4.3" y="5.3" width="3" height="5.7" rx="0.8"/><rect x="8.6" y="2.8" width="3" height="8.2" rx="0.8"/><rect x="12.9" y="0" width="3" height="11" rx="0.8"/></svg>
        <svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor"><path d="M7.5 2.3c2 0 3.8.8 5.1 2l1.1-1.1A8.8 8.8 0 0 0 7.5.7 8.8 8.8 0 0 0 1.3 3.2l1.1 1.1a7.2 7.2 0 0 1 5.1-2Zm0 3.1c1.2 0 2.2.4 3 1.2l1.1-1.1a5.8 5.8 0 0 0-8.2 0l1.1 1.1c.8-.8 1.8-1.2 3-1.2Zm0 3.1c-.5 0-.9.2-1.2.5L7.5 10.2l1.2-1.2c-.3-.3-.7-.5-1.2-.5Z"/></svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none"><rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="18" height="8" rx="2.2" fill="currentColor"/><path d="M23 4v4c.8-.3 1.3-1.1 1.3-2S23.8 4.3 23 4Z" fill="currentColor" opacity=".4"/></svg>
      </span>
    </div>
  );
}
