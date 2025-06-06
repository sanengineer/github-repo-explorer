"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GithubUser, GithubRepo } from "@/types/github";
import { getRepos } from "@/lib/github";
import { Skeleton } from "./Skeleton";
import { ChevronDown, RotateCcw, Trash2 } from "lucide-react";
import Link from "next/link";
import Avatar from "./Avatar";
import SkeletonList from "./SkeletonList";
import { useSearchStore } from "@/store/useSearchStore";
import RepoCard from "./RepoCard";
import SelectFilter from "./SelectFilter";

interface Props {
  users: GithubUser[];
  onClear: () => void;
}

type SortOption = "stars_asc" | "stars_desc" | "most_forks";
type RepoType = "all" | "source" | "forking";

export default function UserAccordionList({ users, onClear }: Props) {
  const [openUsers, setOpenUsers] = useState<Set<string>>(new Set());
  const [repos, setRepos] = useState<Record<string, GithubRepo[]>>({});
  const [loadingUsernames, setLoadingUsernames] = useState<Set<string>>(
    new Set()
  );
  const { isSearching, setIsFirstSearching } = useSearchStore();

  const [filters, setFilters] = useState<
    Record<
      string,
      {
        language: string;
        sort: SortOption;
        type: RepoType;
      }
    >
  >({});

  const handleFilterChange = (
    username: string,
    key: keyof typeof filters[string],
    value: string
  ) => {
    setFilters((prev) => ({
      ...prev,
      [username]: {
        ...prev[username],
        [key]: value,
      },
    }));
  };

  const resetFilters = (username: string) => {
    setFilters((prev) => ({
      ...prev,
      [username]: {
        language: "",
        sort: "stars_desc",
        type: "all",
      },
    }));
  };

  const isFilterActive = (username: string) => {
    const filter = filters[username];
    if (!filter) return false;
    return (
      filter.language !== "" ||
      filter.sort !== "stars_desc" ||
      filter.type !== "all"
    );
  };

  const toggleUser = async (username: string) => {
    const isOpen = openUsers.has(username);

    if (isOpen) {
      setOpenUsers((prev) => {
        const updated = new Set(prev);
        updated.delete(username);
        return updated;
      });
    } else {
      setOpenUsers((prev) => new Set(prev).add(username));

      if (!repos[username]) {
        setLoadingUsernames((prev) => new Set(prev).add(username));
        try {
          const userRepos = await getRepos(username);
          setRepos((prev) => ({ ...prev, [username]: userRepos }));
          setFilters((prev) => ({
            ...prev,
            [username]: {
              language: "",
              sort: "stars_desc",
              type: "all",
            },
          }));
        } catch (error) {
          console.error("Failed to fetch repos:", error);
        } finally {
          setLoadingUsernames((prev) => {
            const updated = new Set(prev);
            updated.delete(username);
            return updated;
          });
        }
      }
    }
  };

  const applyFilters = (username: string): GithubRepo[] => {
    let data = [...(repos[username] || [])];
    const { language, sort, type } = filters[username] || {};

    if (language) {
      data = data.filter((repo) => repo.language === language);
    }
    if (type === "source") {
      data = data.filter((repo) => !repo.fork);
    } else if (type === "forking") {
      data = data.filter((repo) => repo.fork);
    }
    if (sort === "stars_asc") {
      data.sort((a, b) => a.stargazers_count - b.stargazers_count);
    } else if (sort === "stars_desc") {
      data.sort((a, b) => b.stargazers_count - a.stargazers_count);
    } else if (sort === "most_forks") {
      data.sort((a, b) => b.forks_count - a.forks_count);
    }
    return data;
  };

  return (
    <div className="mt-6 space-y-4">
      {isSearching ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-row justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-32" />
          </div>
          <SkeletonList count={5} lines={2} />
        </div>
      ) : (
        <>
          {users.length > 0 && (
            <div className="flex flex-row items-center  justify-between">
              <div className="flex flex-row gap-2">
                <div className="text-xs text-neutral-400 font-bold">
                  Result:
                </div>
                <div className="text-xs text-neutral-950 font-bold">
                  {users.length} {users.length > 1 ? "user" : "users"} found
                </div>
              </div>

              <div className="flex flex-row gap-2 justify-between ">
                <button
                  onClick={() => {
                    onClear();
                    setOpenUsers(new Set());
                    setRepos({});
                    setFilters({});
                    setIsFirstSearching(false);
                  }}
                  className="text-xs text-red-400 font-semibold cursor-pointer flex flex-row items-center gap-2 px-2 py-1 bg-red-100 rounded"
                >
                  <Trash2 size={14} />
                  <div>Clear Result</div>
                </button>
              </div>
            </div>
          )}
          <ul className="space-y-2">
            {users.map((user) => {
              const uniqueLanguages = [
                ...new Set(
                  repos[user.login]?.map((r) => r.language).filter(Boolean)
                ),
              ] as string[];
              const repoList = applyFilters(user.login);

              return (
                <li
                  key={user.id}
                  className="bg-neutral-50 border border-gray-200 rounded px-1 pb-1"
                >
                  <button
                    onClick={() => toggleUser(user.login)}
                    className="flex items-center justify-between w-full text-left hover:bg-gray-50 p-2 rounded"
                  >
                    <div className="flex flex-row items-center gap-3">
                      <Avatar src={user.avatar_url} alt={user.login} />
                      <div className="flex flex-col">
                        <p className="font-medium">{user.login}</p>
                        <Link
                          href={user.html_url}
                          className="text-sm text-blue-500 hover:underline"
                        >
                          <p>{user.html_url}</p>
                        </Link>
                      </div>
                    </div>
                    <ChevronDown
                      size={20}
                      className={`transition-transform text-neutral-400 mt-2 duration-300 ${
                        openUsers.has(user.login) ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {openUsers.has(user.login) && (
                      <motion.div
                        className="mt-0 px-3 pb-3 flex flex-col gap-3"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex flex-row justify-between h-[20px]">
                          {repoList.length !== 0 && (
                            <p className="text-sm text-neutral-600">
                              {repoList.length} repositories found
                            </p>
                          )}
                          {isFilterActive(user.login) && (
                            <button
                              className="flex flex-row gap-2 items-center bg-neutral-800 text-white px-2 py-1 min-w-[90px] rounded"
                              onClick={() => resetFilters(user.login)}
                            >
                              <RotateCcw size={13} />
                              <div className="text-xs font-semibold">
                                Reset Filter
                              </div>
                            </button>
                          )}
                        </div>

                        {loadingUsernames.has(user.login) ? (
                          <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-3 justify-between">
                              <Skeleton className="h-4 w-20" />
                              <div className="flex flex-row gap-3">
                                <Skeleton className="h-4 w-10" />
                                <Skeleton className="h-4 w-10" />
                                <Skeleton className="h-4 w-10" />
                              </div>
                            </div>
                            <SkeletonList count={20} lines={5} />
                          </div>
                        ) : (
                          <>
                            {repoList.length !== 0 && (
                              <div className="flex gap-2 flex-row items-center justify-start">
                                <SelectFilter
                                  value={filters[user.login]?.language || "all"}
                                  onChange={(value) =>
                                    handleFilterChange(
                                      user.login,
                                      "language",
                                      value
                                    )
                                  }
                                  placeholder="Language"
                                  options={[
                                    { label: "All Languages", value: "all" },
                                    ...uniqueLanguages.map((lang) => ({
                                      label: lang,
                                      value: lang,
                                    })),
                                  ]}
                                />

                                <SelectFilter
                                  value={
                                    filters[user.login]?.sort || "stars_desc"
                                  }
                                  onChange={(value) =>
                                    handleFilterChange(
                                      user.login,
                                      "sort",
                                      value
                                    )
                                  }
                                  placeholder="Sort"
                                  options={[
                                    {
                                      label: "Most Stars",
                                      value: "stars_desc",
                                    },
                                    {
                                      label: "Least Stars",
                                      value: "stars_asc",
                                    },
                                    {
                                      label: "Most Forks",
                                      value: "most_forks",
                                    },
                                  ]}
                                />

                                <SelectFilter
                                  value={filters[user.login]?.type || "all"}
                                  onChange={(value) =>
                                    handleFilterChange(
                                      user.login,
                                      "type",
                                      value
                                    )
                                  }
                                  placeholder="Type"
                                  options={[
                                    { label: "All Types", value: "all" },
                                    { label: "Source", value: "source" },
                                    { label: "Forking", value: "forking" },
                                  ]}
                                />
                              </div>
                            )}

                            {repoList.length === 0 ? (
                              <p className="text-sm text-gray-500 text-center">
                                No repositories found.
                              </p>
                            ) : (
                              <ul className="flex flex-col gap-3">
                                {repoList.map((repo) => (
                                  <RepoCard repo={repo} key={repo.id} />
                                ))}
                              </ul>
                            )}
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
