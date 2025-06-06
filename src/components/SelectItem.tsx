import React from "react";
import { Select } from "radix-ui";
import { Check } from "lucide-react";
import classnames from "classnames";

type SelectItemProps = React.ComponentPropsWithoutRef<typeof Select.Item> & {
  children: React.ReactNode;
};

const SelectItem = React.forwardRef<
  React.ComponentRef<typeof Select.Item>,
  SelectItemProps
>(({ children, className, ...props }, forwardedRef) => {
  return (
    <Select.Item
      className={classnames(
        "relative flex h-[25px] select-none items-center rounded-[3px] m-1 pl-[25px] pr-[20px] text-xs leading-none text-neutral-900 data-[disabled]:pointer-events-none data-[highlighted]:bg-neutral-200 data-[disabled]:text-yellow-500 data-[highlighted]:text-neutral-950 data-[highlighted]:outline-none",
        className
      )}
      {...props}
      ref={forwardedRef}
    >
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center">
        <Check size={13} />
      </Select.ItemIndicator>
    </Select.Item>
  );
});

SelectItem.displayName = "SelectItem";

export default SelectItem;
