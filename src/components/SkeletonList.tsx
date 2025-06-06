import React from "react";
import { Skeleton } from "./Skeleton";

interface Props {
  count?: number;
  lines?: number;
}

export default function SkeletonList({ count = 3, lines = 2 }: Props) {
  return (
    <ul className="space-y-2">
      {[...Array(count)].map((_, i) => (
        <li
          key={i}
          className="p-4 flex flex-col gap-3 border border-neutral-200 rounded"
        >
          {[...Array(lines)].map((_, j) => (
            <Skeleton
              key={j}
              className={`h-${j === 0 ? "4" : "3"} w-${
                j === 0 ? "1/2" : "3/4"
              }`}
            />
          ))}
        </li>
      ))}
    </ul>
  );
}
