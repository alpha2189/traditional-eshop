'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { ProductImage } from '@/lib/types';
import { productImageUrl } from '@/lib/utils';

export function Gallery({
  images,
  productName,
}: {
  images: ProductImage[];
  productName: string;
}) {
  const sorted = [...images].sort((a, b) => a.position - b.position);
  const [active, setActive] = useState(0);

  if (sorted.length === 0) {
    return (
      <div
        className="flex aspect-[4/5] items-center justify-center bg-linen
          font-display text-7xl font-extrabold text-linen-deep"
        role="img"
        aria-label={`${productName} — δεν υπάρχει διαθέσιμη φωτογραφία`}
      >
        Τ
      </div>
    );
  }

  const current = sorted[Math.min(active, sorted.length - 1)];

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden bg-linen">
        <Image
          src={productImageUrl(current.storage_path)}
          alt={current.alt || productName}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      {sorted.length > 1 && (
        <ul className="mt-3 flex gap-2" aria-label="Φωτογραφίες προϊόντος">
          {sorted.map((img, i) => (
            <li key={img.id}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Φωτογραφία ${i + 1} από ${sorted.length}`}
                aria-current={i === active}
                className={`relative block h-16 w-14 overflow-hidden bg-linen
                  ${i === active ? 'ring-2 ring-ink' : 'opacity-70 hover:opacity-100'}`}
              >
                <Image
                  src={productImageUrl(img.storage_path)}
                  alt=""
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
