import { GithubRepo, GithubUser } from "@/types/github";

const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

const headers: HeadersInit = GITHUB_TOKEN
  ? {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
    }
  : {
      Accept: "application/vnd.github.v3+json",
    };

export async function searchUsers(query: string): Promise<GithubUser[]> {
  const res = await fetch(
    `https://api.github.com/search/users?q=${query}&per_page=5`,
    {
      headers,
    }
  );
  if (!res.ok) throw new Error("Github API error (search users)");
  const data = await res.json();
  return data.items;
}

export async function getRepos(username: string): Promise<GithubRepo[]> {
  const res = await fetch(`https://api.github.com/users/${username}/repos`, {
    headers,
  });

  if (!res.ok) throw new Error("Github API error (get repos)");
  return res.json();
}
