// components/Tile.tsx
import Image from "next/image";

interface TileProps {
  title: string;
  iconSrc: string;
  comingSoon?: boolean;
  onClick?: () => void;
}

export default function Tile({ title, iconSrc, comingSoon = false, onClick }: TileProps) {
  return (
    <div
      onClick={comingSoon ? undefined : onClick}
      className={`w-[160px] h-[160px] rounded-2xl border shadow-md flex flex-col items-center justify-center gap-2 cursor-pointer hover:shadow-lg transition ${
        comingSoon ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <div className="relative w-12 h-12">
        <Image src={iconSrc} alt={title} fill className="object-contain" />
        {comingSoon && (
          <div className="absolute -top-2 -right-2 text-xs px-2 py-0.5 bg-orange-500 text-white rounded-full text-center">
            Coming Soon
          </div>
        )}
      </div>
      <div className="text-sm text-center">{title}</div>
    </div>
  );
}
