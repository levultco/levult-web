export type PosterKind = "vinilo" | "indigo" | "roja" | "jazz" | "neon";

/** Event posters drawn in type, in the spirit of the flyers venues upload to ParyUp. */
export function Poster({ kind, size = "lg" }: { kind: PosterKind; size?: "lg" | "sm" }) {
  const s = size === "lg" ? 1 : 0.55;
  const px = (n: number) => `${n * s}px`;

  if (kind === "vinilo") {
    return (
      <div className="absolute inset-0 overflow-hidden bg-[#140d08] text-white">
        <span aria-hidden="true" className="absolute left-[18%] top-[30%] h-[46%] w-[64%] rounded-full bg-[#c9661f] opacity-70 blur-[34px]" />
        <span aria-hidden="true" className="absolute left-[46%] top-[44%] h-[22%] w-[30%] rounded-full bg-[#ffd08a] opacity-60 blur-[22px]" />
        <p className="absolute inset-x-0 top-[5%] text-center font-black tracking-[-0.06em]" style={{ fontSize: px(17) }}>SALA NEÓN</p>
        <p className="absolute inset-x-0 top-[11%] text-center font-serif" style={{ fontSize: px(19) }}>14.10</p>
        <p className="absolute inset-x-0 top-[28%] text-center font-serif tracking-[0.55em]" style={{ fontSize: px(17) }}>VINILO</p>
        <p className="absolute inset-x-0 top-[33%] text-center font-black leading-none tracking-[-0.08em] text-[#f4efe6]" style={{ fontSize: px(118) }}>
          90&rsquo;
        </p>
      </div>
    );
  }

  if (kind === "indigo") {
    return (
      <div className="absolute inset-0 overflow-hidden bg-[#2232d6]">
        <p className="absolute left-[7%] top-[6%] font-black uppercase leading-[0.82] tracking-[-0.07em] text-[#ff8a1f]" style={{ fontSize: px(54) }}>
          Terraza
          <br />
          <span className="text-[#c7cdf6]">club</span>
        </p>
        <p className="absolute left-[7%] top-[46%] font-black uppercase leading-[0.82] tracking-[-0.07em] text-[#ff8a1f]" style={{ fontSize: px(54) }}>
          vol. 3
        </p>
        <p className="absolute bottom-[34%] right-[7%] text-right font-semibold uppercase leading-tight text-white/80" style={{ fontSize: px(10) }}>
          dj set
          <br />
          atardecer
        </p>
      </div>
    );
  }

  if (kind === "roja") {
    return (
      <div className="absolute inset-0 overflow-hidden bg-[#cf3a2d]">
        <p className="absolute inset-x-0 top-[6%] text-center font-bold uppercase tracking-[-0.03em] text-[#2a0d09]" style={{ fontSize: px(15) }}>
          Lavapiés live
        </p>
        <p className="absolute inset-x-[6%] top-[22%] font-black uppercase leading-[0.8] tracking-[-0.08em] text-[#2a0d09]" style={{ fontSize: px(84) }}>
          Sala
          <br />
          roja
        </p>
        <span aria-hidden="true" className="absolute bottom-[28%] right-[8%] rounded-full bg-[#2a0d09]" style={{ width: px(46), height: px(46) }} />
      </div>
    );
  }

  if (kind === "jazz") {
    return (
      <div className="absolute inset-0 overflow-hidden bg-[#efe5cf] text-[#17120c]">
        <p className="absolute left-[8%] top-[8%] font-serif italic leading-none" style={{ fontSize: px(52) }}>
          Jazz &amp;
        </p>
        <p className="absolute left-[7%] top-[26%] font-black uppercase leading-none tracking-[-0.07em]" style={{ fontSize: px(58) }}>
          Vermut
        </p>
        <span aria-hidden="true" className="absolute left-[8%] top-[48%] rounded-full bg-[#b3321f]" style={{ width: px(30), height: px(30) }} />
        <p className="absolute left-[8%] top-[60%] font-semibold" style={{ fontSize: px(12) }}>
          Domingos · Café Olmo
        </p>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0b0b0b]">
      {[0, 1, 2, 3].map((i) => (
        <p
          key={i}
          className="absolute inset-x-0 text-center font-black uppercase leading-none tracking-[-0.06em]"
          style={{
            top: `${6 + i * 15}%`,
            fontSize: px(58),
            color: i === 1 ? "#c6f24a" : "transparent",
            WebkitTextStroke: i === 1 ? undefined : `1px #c6f24a`,
          }}
        >
          B-side
        </p>
      ))}
    </div>
  );
}
