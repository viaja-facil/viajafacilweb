"use client";

import SearchCard from "@/components/sections/SearchCard";
import { useSearchForm } from "@/hooks/useSearchForm";

export default function HomeSearch() {
  const searchForm = useSearchForm();
  return <SearchCard {...searchForm} />;
}
