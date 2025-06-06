import { GithubUser } from "@/types/github";

interface Props {
  users: GithubUser[];
  onSelect: (username: string) => void;
}

export default function UserList({ users, onSelect }: Props) {
  if (users.length === 0) return null;

  return (
    <div className="mt-4 space-y-2">
      <h2 className="text-lg font-semibold">Results:</h2>
      <ul className="space-y-2">
        {users.map((user) => (
          <li
            key={user.id}
            onClick={() => onSelect(user.login)}
            className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50"
          >
            <img
              src={user.avatar_url}
              alt={user.login}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <p className="font-medium">{user.login}</p>
              <a
                href={user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-500 hover:underline"
              >
                View Profile
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
