"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React, { FormEvent, useRef } from "react";
import { Button } from "./ui/button";

interface Form {
  type: "text" | "textarea";
  id: string;
  label: string;
  defaultValue?: string;
  required?: boolean;
  disabled?: boolean;
}

interface FormGroupProps {
  items: Form[];
  onSubmit: (values: Record<string, string>) => Promise<void>;
}

export default function FormGroup({ items, onSubmit }: FormGroupProps) {
  const formRef = useRef<HTMLFormElement | null>(null);

  const onFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values: Record<string, string> = {};
    formData.forEach((value, key) => {
      values[key] = value as string;
    });
    await onSubmit(values);
  };

  return (
    <form
      ref={formRef}
      onSubmit={onFormSubmit}
      className="py-4 px-5 w-full flex flex-col items-center"
    >
      <div className="max-w-[600px] w-full flex flex-col gap-4">
        {items.map((value, index) => (
          <React.Fragment key={index}>
            {value.type === "text" && (
              <div className="flex flex-col gap-2">
                <Label htmlFor={value.id}>{value.label}</Label>
                <Input
                  id={value.id}
                  name={value.id}
                  placeholder={value.label}
                  defaultValue={value.defaultValue ?? ""}
                  required={(value.required ?? false) && !value.disabled}
                  disabled={value.disabled ?? false}
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
                  defaultValue={value.defaultValue ?? ""}
                  required={(value.required ?? false) && !value.disabled}
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
