"use client";

import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounceCallback } from "usehooks-ts";

interface MarketSearchProps {
  showTitle?: boolean;
}

export function MarketSearch({ showTitle = true }: MarketSearchProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSearch = useDebounceCallback((search: string) => {
    const params = new URLSearchParams(searchParams);
    if (search.length) params.set("search", search);
    else params.delete("search");
    router.push(`?${params.toString()}`);
  }, 500);

  return (
    <>
      {showTitle && (
        <motion.div
          key="marketplace"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold mb-2">Marketplace</h1>
          <div className="w-2/3 mx-auto">
            <p className="text-muted-foreground mb-4">
              Discover and create custom versions prompts that combine
              instructions, extra knowledge, and any combination of skills.
            </p>
          </div>
        </motion.div>
      )}
      <motion.div
        key="marketsearch"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ delay: 0.3 }}
        className="sticky top-2.5 z-20 text-center w-3/5 max-w-screen-lg mx-auto"
      >
        <div className="inline-flex relative w-full justify-center">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search"
            className="pl-9"
            onChange={(e) => {
              handleSearch(e.target.value);
            }}
            defaultValue={searchParams.get("search")?.toString()}
          />
        </div>
      </motion.div>
    </>
  );
}
