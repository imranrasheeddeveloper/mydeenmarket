"use client";

import { useEffect } from "react";
import { trackViewContent } from "@/lib/tracking-client";

type Props = {
  id: string;
  name: string;
  price: number;
  category: string;
};

export default function ProductViewTracker({ id, name, price, category }: Props) {
  useEffect(() => {
    trackViewContent({ id, name, price, category });
  }, [id, name, price, category]);

  return null;
}