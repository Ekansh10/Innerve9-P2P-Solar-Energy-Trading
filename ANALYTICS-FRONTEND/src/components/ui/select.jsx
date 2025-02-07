import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";

export function Select({ value, onValueChange, options, className }) {
  return (
    <SelectPrimitive.Root value={value} onValueChange={onValueChange}>
      <SelectPrimitive.Trigger className={`flex items-center justify-between border rounded-md px-4 py-2 ${className}`}>
        {value} <ChevronDown size={16} />
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Content className="bg-white border rounded-md shadow-md">
        {options.map((option) => (
          <SelectPrimitive.Item key={option.value} value={option.value} className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
            {option.label}
          </SelectPrimitive.Item>
        ))}
      </SelectPrimitive.Content>
    </SelectPrimitive.Root>
  );
}
