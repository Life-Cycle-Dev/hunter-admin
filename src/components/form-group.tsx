"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { Switch } from "./ui/switch";

export interface SelectOption {
  label: string;
  value: string;
}

interface Form {
  type: "text" | "textarea" | "checkbox" | "switch";
  id: string;
  label: string;
  defaultValue?: string | string[] | boolean;
  required?: boolean;
  disabled?: boolean;
  options?: SelectOption[];
  onchange?: (value: unknown) => void;
}

interface FormGroupProps {
  items: Form[];
  onSubmit: (values: Record<string, unknown>) => Promise<void>;
}

export default function FormGroup({ items, onSubmit }: FormGroupProps) {
  const formRef = useRef<HTMLFormElement | null>(null);

  const [switchValues, setSwitchValues] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setSwitchValues(
      items.reduce((acc, item) => {
        if (item.type === "switch") {
          acc[item.id] =
            item.defaultValue === undefined ? true : Boolean(item.defaultValue);
        }
        return acc;
      }, {} as Record<string, boolean>),
    );
  }, [items]);

  const onFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values: Record<string, string | string[] | boolean> = {};
    items.forEach((item) => {
      if (item.type === "checkbox" && item.options) {
        const checkedValues = formData.getAll(item.id) as string[];
        values[item.id] = checkedValues;
      } else if (item.type === "switch") {
        values[item.id] = switchValues[item.id];
      } else {
        const value = formData.get(item.id);
        if (value !== null) {
          values[item.id] = value as string;
        }
      }
    });
    await onSubmit(values);
  };

  return (
    <form
      ref={formRef}
      onSubmit={onFormSubmit}
      className="py-4 px-5 w-full flex flex-col items-center"
    >
      <div className="max-w-[600px] w-full flex flex-col gap-6">
        {items.map((value, index) => (
          <React.Fragment key={index}>
            {value.type === "text" && (
              <div className="flex flex-col gap-2">
                <Label htmlFor={value.id}>{value.label}</Label>
                <Input
                  id={value.id}
                  name={value.id}
                  placeholder={value.label}
                  defaultValue={(value.defaultValue ?? "") as string}
                  required={(value.required ?? false) && !value.disabled}
                  disabled={value.disabled ?? false}
                  onChange={(e) => value.onchange?.(e.target.value)}
                />
              </div>
            )}

            {value.type === "textarea" && (
              <div className="flex flex-col gap-2">
                <Label htmlFor={value.id}>{value.label}</Label>
                <Textarea
                  id={value.id}
                  name={value.id}
                  placeholder={value.label}
                  defaultValue={(value.defaultValue ?? "") as string}
                  required={(value.required ?? false) && !value.disabled}
                  disabled={value.disabled ?? false}
                  onChange={(e) => value.onchange?.(e.target.value)}
                />
              </div>
            )}

            {value.type === "checkbox" && value.options && (
              <div className="flex flex-col gap-2">
                <Label htmlFor={value.id} className="mb-3">
                  {value.label}
                </Label>
                {value.options.map((option, index) => {
                  let checked = false;
                  if (Array.isArray(value.defaultValue)) {
                    checked = value.defaultValue.includes(option.value);
                  } else if (typeof value.defaultValue === "string") {
                    checked = value.defaultValue
                      .split(",")
                      .includes(option.value);
                  }
                  return (
                    <div className="flex items-center gap-3" key={index}>
                      <Checkbox
                        id={`${value.id}_${option.value}`}
                        name={value.id}
                        value={option.value}
                        defaultChecked={checked}
                        onCheckedChange={(e) => value.onchange?.(e)}
                      />
                      <Label htmlFor={`${value.id}_${option.value}`}>
                        {option.label}
                      </Label>
                    </div>
                  );
                })}
              </div>
            )}

            {value.type === "switch" && (
              <div className="flex flex-col gap-2">
                <Label htmlFor={value.id}>{value.label}</Label>
                <Switch
                  id={value.id}
                  name={value.id}
                  checked={switchValues[value.id] ?? false}
                  onCheckedChange={(checked) => {
                    setSwitchValues((prev) => ({
                      ...prev,
                      [value.id]: checked,
                    }));
                    value.onchange?.(checked);
                  }}
                  disabled={value.disabled ?? false}
                />
              </div>
            )}
          </React.Fragment>
        ))}
        <div className="mt-4 w-full flex justify-end">
          <Button type="submit">Submit</Button>
        </div>
      </div>
    </form>
  );
}
