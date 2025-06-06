import Image from "next/image";
import { useState } from "react";

function Avatar({ src, alt }: { src: string; alt: string }) {
  const [imgError, setImgError] = useState(false);

  const initials = alt
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return imgError ? (
    <div className="w-8 h-8 rounded-xl bg-gray-300 flex items-center justify-center text-xs font-bold text-white">
      {initials}
    </div>
  ) : (
    <Image
      src={src}
      alt={alt}
      height={100}
      width={100}
      loading="lazy"
      className="w-10 h-10 rounded-md object-contain"
      onError={() => setImgError(true)}
    />
  );
}

export default Avatar;
