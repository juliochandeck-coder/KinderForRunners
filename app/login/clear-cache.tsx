"use client";
import { useEffect } from "react";

// Al cerrar sesión se borra la copia offline del generador en este dispositivo.
export default function ClearCache() {
  useEffect(() => {
    if ("caches" in window) caches.keys().then((ks) => ks.filter((k) => k.startsWith("k4r-")).forEach((k) => caches.delete(k)));
  }, []);
  return null;
}
