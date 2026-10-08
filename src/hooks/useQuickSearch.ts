"use client";
import { useRouter } from "next/navigation";
import { buildQuickBookParams } from "@/lib/search-params";
export function useQuickSearch() {
  const router = useRouter();
  return (route: { originCode: string; destCode: string }) => router.push(`/search?${buildQuickBookParams(route.originCode, route.destCode)}`);
}
