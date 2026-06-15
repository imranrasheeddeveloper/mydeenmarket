"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface Props {
  images: string[];
  imageUrl?: string | null;
  alt: string;
  gradient: string;
  badge?: string | null;
  fallbackIcon?: React.ReactNode;
}

export default function ProductImageGallery({
  images,
  imageUrl,
  alt,
  gradient,
  badge,
  fallbackIcon,
}: Props) {
  // Merge images array + legacy imageUrl into a deduplicated list
  const allImages = (() => {
    const combined = images?.length > 0 ? images : imageUrl ? [imageUrl] : [];
    return [...new Set(combined.filter(Boolean))];
  })();

  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [lightbox, setLightbox] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hoveringRef = useRef(false);

  const total = allImages.length;

  const next = useCallback(() => {
    if (total > 1) setActive((i) => (i + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    if (total > 1) setActive((i) => (i - 1 + total) % total);
  }, [total]);

  // Auto-scroll every 4 seconds, pauses on hover
  useEffect(() => {
    if (total <= 1) return;
    intervalRef.current = setInterval(() => {
      if (!hoveringRef.current) next();
    }, 4000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [total, next]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const badgeLabel =
    badge === "bestseller" ? "Best Seller" : badge === "new" ? "New" : badge === "sale" ? "Sale" : badge;

  const badgeCls =
    badge === "bestseller"
      ? "bg-amber-500 text-white"
      : badge === "new"
      ? "bg-emerald-600 text-white"
      : "bg-red-500 text-white";

  return (
    <>
      <div className="space-y-3">
        {/* Main image */}
        <div
          className={`relative aspect-[3/4] rounded-2xl bg-gradient-to-br ${gradient} overflow-hidden cursor-zoom-in select-none`}
          onMouseEnter={() => {
            hoveringRef.current = true;
          }}
          onMouseLeave={() => {
            hoveringRef.current = false;
            setZoomed(false);
          }}
          onMouseMove={handleMouseMove}
          onClick={() => {
            if (allImages.length > 0) {
              if (zoomed) {
                setZoomed(false);
              } else {
                setLightbox(true);
              }
            }
          }}
        >
          {allImages.length > 0 ? (
            <div
              className="absolute inset-0 transition-transform duration-300"
              style={
                zoomed
                  ? {
                      transform: "scale(2)",
                      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                      cursor: "zoom-out",
                    }
                  : {}
              }
            >
              <img
                src={allImages[active]}
                alt={`${alt} — image ${active + 1}`}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
              {fallbackIcon}
            </div>
          )}

          {/* Badge */}
          {badge && (
            <span className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold z-10 ${badgeCls}`}>
              {badgeLabel}
            </span>
          )}

          {/* Navigation arrows */}
          {total > 1 && !zoomed && (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/80 hover:bg-white shadow text-gray-700 transition-opacity opacity-60 hover:opacity-100"
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/80 hover:bg-white shadow text-gray-700 transition-opacity opacity-60 hover:opacity-100"
              >
                ›
              </button>
            </>
          )}

          {/* Dot indicators */}
          {total > 1 && (
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
              {allImages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to image ${i + 1}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActive(i);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === active ? "bg-white scale-125" : "bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Zoom hint */}
          {allImages.length > 0 && !zoomed && (
            <span className="absolute bottom-3 right-3 z-10 text-xs text-white/70 hidden sm:block">
              🔍 Hover to zoom
            </span>
          )}
        </div>

        {/* Thumbnail strip */}
        {total > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {allImages.map((url, i) => (
              <button
                key={url + i}
                type="button"
                onClick={() => setActive(i)}
                className={`shrink-0 w-16 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  i === active
                    ? "border-emerald-600 shadow-md"
                    : "border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100"
                }`}
              >
                <img src={url} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && allImages.length > 0 && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
          onClick={() => setLightbox(false)}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setLightbox(false)}
            className="absolute top-4 right-4 text-white text-3xl w-10 h-10 flex items-center justify-center hover:text-gray-300"
          >
            ×
          </button>

          {total > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-5xl w-12 h-12 flex items-center justify-center hover:text-gray-300"
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Next"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-5xl w-12 h-12 flex items-center justify-center hover:text-gray-300"
              >
                ›
              </button>
            </>
          )}

          <img
            src={allImages[active]}
            alt={alt}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

          {total > 1 && (
            <div className="absolute bottom-6 flex gap-2">
              {allImages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActive(i);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === active ? "bg-white" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
