export type LogoProps = {
  /** Tile size in px (square). Default 40. */
  size?: number;
  /** Show the "Moviin" wordmark next to the tile. Default true. */
  wordmark?: boolean;
  className?: string;
};

/** The mark (170x110 JPEG on light bg) sits in a white rounded tile, white in both themes. */
export default function Logo({ size = 40, wordmark = true, className = "" }: LogoProps) {
  const markW = Math.round(size * 0.75);
  const markH = Math.round((markW * 110) / 170);
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        className="grid shrink-0 place-items-center rounded-[12px] bg-white ring-1 ring-line"
        style={{ width: size, height: size }}
      >
        <img src="/mark.png" alt={wordmark ? "" : "Moviin"} width={markW} height={markH} className="block" />
      </span>
      {wordmark ? (
        <span className="font-display text-[18px] font-extrabold tracking-[-0.02em] text-ink">Moviin</span>
      ) : null}
    </span>
  );
}
