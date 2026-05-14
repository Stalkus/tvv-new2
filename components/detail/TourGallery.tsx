import Image from "next/image";

const fallback = [
  "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?auto=format&fit=crop&w=1600&q=85",
  "https://images.unsplash.com/photo-1540202404-1b927e27fa8b?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=900&q=85",
];

export function TourGallery({ images = fallback, alt }: { images?: string[]; alt: string }) {
  const main = images[0] ?? fallback[0];
  const thumbs = (images.length > 1 ? images.slice(1) : fallback.slice(1)).slice(0, 4);
  return (
    <div className="grid gap-3 sm:grid-cols-[1.6fr,1fr]">
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
        <Image
          src={main}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {thumbs.map((img, i) => (
          <div key={i} className="relative aspect-square overflow-hidden rounded-lg">
            <Image
              src={img}
              alt=""
              fill
              sizes="25vw"
              className="object-cover"
            />
            {i === thumbs.length - 1 && (
              <button className="absolute bottom-2 right-2 rounded-md bg-white/95 px-3 py-1.5 text-[11px] font-medium text-ink shadow-card">
                + View all {Math.max(images.length, fallback.length)} photos
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
