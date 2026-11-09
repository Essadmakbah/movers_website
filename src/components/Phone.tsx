export type PhoneProps = {
  src: string;
  alt: string;
  /** Rendered screen width in px. Default: the native width. Never pass more than native. */
  width?: number;
  /** Native pixel size of the screenshot. Default 226x512. home/review-price are ~182/183x512. */
  nativeWidth?: number;
  nativeHeight?: number;
  className?: string;
  /** Eager-load with high fetch priority (LCP image). Default false (lazy). */
  priority?: boolean;
};

/**
 * Dark device frame that hugs the screenshot at its own aspect ratio.
 * 8px bezel, 40px outer radius, 32px screen radius. Stays dark in both themes.
 */
export default function Phone({
  src,
  alt,
  nativeWidth = 226,
  nativeHeight = 512,
  width = nativeWidth,
  className = "",
  priority = false,
}: PhoneProps) {
  const w = Math.min(width, nativeWidth);
  const h = Math.round((w * nativeHeight) / nativeWidth);
  return (
    <figure
      className={`relative m-0 inline-block shrink-0 rounded-[40px] bg-device p-2 shadow-[var(--shadow-device)] ring-1 ring-black/10 ${className}`}
      style={{ width: w + 16 }}
    >
      <img
        src={src}
        alt={alt}
        width={w}
        height={h}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        draggable={false}
        className="block h-auto w-full rounded-[32px] ring-1 ring-white/10"
      />
      <span aria-hidden="true" className="absolute -right-[3px] top-28 h-14 w-[3px] rounded-r bg-device" />
    </figure>
  );
}
