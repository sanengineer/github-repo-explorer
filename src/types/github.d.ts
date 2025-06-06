export interface GithubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
}

export interface GithubRepo {
  fork: any;
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
}
