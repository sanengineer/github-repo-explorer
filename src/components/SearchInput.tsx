"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  onSearch: (query: string) => void;
}

export default function SearchInput({ onSearch }: Props) {
  const [value, setValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value.trim());
    }, 500);

    return () => clearTimeout(timeout);
  }, [value]);

  useEffect(() => {
    if (debouncedValue !== "") {
      onSearch(debouncedValue);
    }
  }, [debouncedValue, onSearch]);

  return (
    <div className="flex flex-row gap-2 justify-between items-center w-full">
      <input
        type="text"
        className="w-full px-3 py-1 border-[1px] text-sm border-neutral-200 bg-white rounded focus:outline-none focus:ring focus:ring-green-500"
        placeholder="Search Github users..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {value && (
        <button
          className="text-sm text-red-500 h-6 w-6 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-400 hover:text-red-100"
          onClick={() => {
            setValue("");
            setDebouncedValue("");
          }}
        >
          <X size={14} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}
