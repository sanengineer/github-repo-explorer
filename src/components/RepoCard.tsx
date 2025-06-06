import React from "react";
import Link from "next/link";
import { GithubRepo } from "@/types/github";
import { GitFork, SquareCode, Star, ForkKnife, Laptop } from "lucide-react";

interface Props {
  repo: GithubRepo;
}

export default function RepoCard({ repo }: Props) {
  return (
    <li
      onClick={() =>
        window.open(repo.html_url, "_blank", "noopener,noreferrer")
      }
      className="p-3 flex flex-col gap-3 border rounded-sm border-gray-300 hover:border hover:radius-md hover:border-gray-300 hover:cursor-pointer transition duration-500 hover:bg-gray-200"
    >
      <Link
        href={repo.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 font-semibold hover:underline"
      >
        {repo.name}
      </Link>
      {repo.description && (
        <p className="text-sm text-gray-600">{repo.description}</p>
      )}
      <div className="text-xs text-neutral-500 mt-1 flex gap-4">
        {repo.fork ? (
          <div className="flex flex-row items-center gap-1">
            <GitFork size={13} strokeWidth={2.5} />
            <div className="text-xs font-semibold">{"Forked"}</div>
          </div>
        ) : (
          <div className="flex flex-row items-center gap-1">
            <SquareCode size={13} strokeWidth={2.5} />
            <div className="text-xs font-semibold">{"Source"}</div>
          </div>
        )}

        <div className="flex flex-row items-center gap-1">
          <Star size={13} strokeWidth={2.5} />
          <div className="text-xs font-semibold mt-0.5">
            {repo.stargazers_count}
          </div>
        </div>

        <div className="flex flex-row items-center gap-1">
          <ForkKnife size={13} strokeWidth={2.5} />
          <div className="text-xs font-semibold mt-0.5">{repo.forks_count}</div>
        </div>

        {repo.language && (
          <div className="flex flex-row items-center gap-1">
            <Laptop size={13} strokeWidth={2.5} />
            <div className="text-xs font-semibold">{repo.language}</div>
          </div>
        )}
      </div>
    </li>
  );
}
