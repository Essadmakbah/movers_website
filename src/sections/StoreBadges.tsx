import { AppleLogo, GooglePlayLogo } from "@phosphor-icons/react";

type Props = {
  ios: string;
  android: string;
  /** "panel" = on the deep green CTA panel, "page" = on the canvas. */
  surface?: "panel" | "page";
  /** Accessible name of the app, used in link labels. */
  appName: string;
};

const looks = {
  panel: "bg-brand-strong text-white ring-1 ring-white/12",
  page: "bg-ink text-canvas ring-1 ring-line",
} as const;

function Badge({
  href,
  store,
  surface,
  appName,
}: {
  href: string;
  store: "ios" | "android";
  surface: "panel" | "page";
  appName: string;
}) {
  const Icon = store === "ios" ? AppleLogo : GooglePlayLogo;
  const top = store === "ios" ? "Download on the" : "Get it on";
  const name = store === "ios" ? "App Store" : "Google Play";
  const live = href.length > 0;

  const body = (
    <>
      <Icon size={26} weight="fill" aria-hidden="true" className="shrink-0" />
      <span className="flex flex-col items-start leading-none">
        <span className="text-[11px] opacity-80">{top}</span>
        <span className="mt-1 font-display text-base font-bold">{name}</span>
      </span>
    </>
  );

  const shape =
    "inline-flex h-14 w-full items-center justify-center gap-3 rounded-[16px] px-4 sm:w-auto sm:justify-start sm:min-w-[184px]";

  return (
    <div className="flex w-full flex-col items-center gap-1.5 sm:w-auto sm:items-start">
      {live ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${appName} on the ${name}`}
          className={`${shape} ${looks[surface]} select-none transition-transform duration-[140ms] ease-out active:scale-[0.97]`}
        >
          {body}
        </a>
      ) : (
        <>
          <span
            role="img"
            aria-label={`${appName} on the ${name}, coming soon`}
            className={`${shape} ${looks[surface]} cursor-not-allowed opacity-55`}
          >
            {body}
          </span>
          <span
            aria-hidden="true"
            className={`text-[12.5px] font-semibold ${surface === "panel" ? "text-on-brand-muted" : "text-ink-3"}`}
          >
            Coming soon
          </span>
        </>
      )}
    </div>
  );
}

export default function StoreBadges({ ios, android, surface = "page", appName }: Props) {
  return (
    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
      <Badge href={ios} store="ios" surface={surface} appName={appName} />
      <Badge href={android} store="android" surface={surface} appName={appName} />
    </div>
  );
}
