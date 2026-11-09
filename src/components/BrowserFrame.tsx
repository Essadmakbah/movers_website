export type BrowserFrameProps = {
  src: string;
  alt: string;
  /** Native width of the screenshot, also the max rendered width. Default 512. Never upscaled. */
  width?: number;
  /** Native height. Default 410 (dispatch.png). */
  height?: number;
  className?: string;
  priority?: boolean;
};

/** Neutral browser chrome: three dots, no fake URL, no traffic-light colours. */
export default function BrowserFrame({
  src,
  alt,
  width = 512,
  height = 410,
  className = "",
  priority = false,
}: BrowserFrameProps) {
  return (
    <figure
      className={`m-0 w-full overflow-hidden rounded-[20px] bg-surface shadow-[var(--shadow-float)] ring-1 ring-line ${className}`}
      style={{ maxWidth: width }}
    >
      <div aria-hidden="true" className="flex h-9 items-center gap-1.5 border-b border-line bg-surface-alt px-3.5">
        <span className="size-[9px] rounded-full bg-line-strong" />
        <span className="size-[9px] rounded-full bg-line-strong" />
        <span className="size-[9px] rounded-full bg-line-strong" />
      </div>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        draggable={false}
        className="block h-auto w-full"
      />
    </figure>
  );
}
