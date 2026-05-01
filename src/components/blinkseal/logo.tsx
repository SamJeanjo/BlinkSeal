import Image from "next/image";

const logoUrl =
  "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697acbc8167be31657691f90/68f25446c_BLINKSEAL_Ogo.png";

export function LogoIcon({ size = 36, pulse = false }: { size?: number; pulse?: boolean }) {
  return (
    <Image
      src={logoUrl}
      alt="BlinkSeal"
      width={size}
      height={size}
      className={pulse ? "[animation:shieldPulse_1.8s_ease-in-out_infinite]" : ""}
      style={{ objectFit: "contain" }}
      unoptimized
    />
  );
}

export function BrandMark() {
  return (
    <div className="flex items-center gap-2.5">
      <LogoIcon size={36} />
      <span className="text-xl tracking-wide text-slate-900">
        <span className="font-normal">Blink</span>
        <span className="font-semibold">Seal</span>
      </span>
    </div>
  );
}
