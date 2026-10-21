"use client";

import dynamic from "next/dynamic";

const SniperApp = dynamic(
  () => import("@/components/sniper/app").then((m) => m.SniperApp),
  { ssr: false },
);

export default function Home() {
  return <SniperApp />;
}
