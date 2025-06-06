"use client";

import { useState, useCallback } from "react";
import SearchInput from "@/components/SearchInput";
import { searchUsers } from "@/lib/github";
import type { GithubUser } from "@/types/github";
import UserAccordionList from "@/components/UserAccordionList";
import { useSearchStore } from "@/store/useSearchStore";
import classNames from "classnames";
import { motion } from "framer-motion";
import { Github, RefreshCcw } from "lucide-react";
import { toast } from "sonner";

export default function HomePage() {
  const [users, setUsers] = useState<GithubUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastQuery, setLastQuery] = useState<string>("");

  const { setIsSearching, isFirstSearchng, setIsFirstSearching } =
    useSearchStore();

  const handleSearch = useCallback(
    async (query: string) => {
      if (!query || query.trim() === "") return;

      setLastQuery(query);
      setError(null);
      setIsSearching(true);
      setIsFirstSearching(true);

      try {
        const result = await searchUsers(query);
        setUsers(result);
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to fetch users. Please try again later.";
        setError(message);
        toast.error(message);
      } finally {
        setIsSearching(false);
      }
    },
    [setIsFirstSearching, setIsSearching]
  );

  return (
    <motion.main
      layout
      transition={{ duration: 0.7, ease: "easeInOut" }}
      className={classNames(
        "min-h-screen px-4 py-10 bg-gray-100 text-gray-900",
        {
          "flex justify-center items-center": !isFirstSearchng,
          block: isFirstSearchng,
        }
      )}
    >
      <div className="max-w-2xl mx-auto w-full">
        <div className="flex flex-row items-center gap-2 mb-8 justify-center">
          <Github size={20} strokeWidth={3} />
          <h1 className="text-lg font-bold text-center">
            Github Repo Explorer
          </h1>
        </div>
        <SearchInput onSearch={handleSearch} />
        {error && (
          <div className="mt-4 flex flex-col items-center text-center gap-2">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => handleSearch(lastQuery)}
              className="flex flex-row gap-2 px-4 py-1 border border-red-500 text-red-500 rounded hover:bg-red-50"
            >
              <RefreshCcw size={12} className="text-red-400" />
              <div className="text-xs">Retry</div>
            </button>
          </div>
        )}
        <UserAccordionList users={users} onClear={() => setUsers([])} />
      </div>
    </motion.main>
  );
}
