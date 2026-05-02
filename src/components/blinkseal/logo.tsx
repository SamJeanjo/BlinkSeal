import Image from "next/image";

type LogoVariant = "dark" | "light";

const logoSources: Record<LogoVariant, string> = {
  dark: "/brand/logo.png",
  light: "/brand/logo_white.png"
};

export function LogoIcon({
  size = 36,
  pulse = false,
  variant = "light",
  className = ""
}: {
  size?: number;
  pulse?: boolean;
  variant?: LogoVariant;
  className?: string;
}) {
  return (
    <Image
      src={logoSources[variant]}
      alt="BlinkSeal"
      width={size}
      height={size}
      className={`${pulse ? "[animation:shieldPulse_1.8s_ease-in-out_infinite]" : ""} ${className}`}
      style={{ objectFit: "contain" }}
    />
  );
}

export function BrandMark({ variant = "light" }: { variant?: LogoVariant }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-xl bg-transparent">
        <LogoIcon
          size={34}
          variant={variant}
          className={`rounded-xl ${variant === "dark" ? "mix-blend-screen opacity-90" : ""}`}
        />
      </span>
      <span className="text-xl tracking-wide text-slate-900">
        <span className="font-normal">Blink</span>
        <span className="font-semibold">Seal</span>
      </span>
    </div>
  );
}
