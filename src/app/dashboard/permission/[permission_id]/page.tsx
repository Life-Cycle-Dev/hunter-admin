"use client";
import FormGroup from "@/components/form-group";
import { useHelperContext } from "@/components/providers/helper-provider";
import { useEffect } from "react";

export default function Page() {
  const { setTitle } = useHelperContext()();

  useEffect(() => {
    setTitle("Create Permission");
  }, [setTitle]);

  const onSubmit = async (values: Record<string, string>) => {
    console.log(values);
  };

  return (
    <div className="mx-5">
      <FormGroup
        items={[
          {
            type: "text",
            id: "title",
            label: "Title",
            required: true,
          },
          {
            type: "text",
            id: "mapping",
            label: "Mapping",
            required: true,
          },
        ]}
        onSubmit={onSubmit}
      />
    </div>
  );
}
