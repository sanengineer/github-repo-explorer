"use client";

import React from "react";
import { Select } from "radix-ui";
import { ChevronDown } from "lucide-react";
import SelectItem from "./SelectItem";

interface SelectFilterProps {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
}

export default function SelectFilter({
  value,
  onChange,
  options,
  placeholder = "Select",
}: SelectFilterProps) {
  return (
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger
        className={`inline-flex items-center justify-between px-2 py-1 border border-neutral-300 bg-gray-200  rounded text-xs font-semibold gap-1 min-w-[90px] hover:bg-neutral-200`}
      >
        <Select.Value placeholder={placeholder} />
        <Select.Icon>
          <ChevronDown size={16} />
        </Select.Icon>
      </Select.Trigger>
      <Select.Content
        className="border border-neutral-300 rounded bg-white shadow mt-2 min-w-[100px]"
        position="popper"
      >
        {options.map((opt) => (
          <SelectItem value={opt.value} key={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </Select.Content>
    </Select.Root>
  );
}
