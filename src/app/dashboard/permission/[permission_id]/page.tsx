/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import FormGroup from "@/components/form-group";
import { useHelperContext } from "@/components/providers/helper-provider";
import { isErrorResponse, Permission } from "@/types/payload";
import { use, useEffect, useState } from "react";

type PageProps = {
  params: Promise<{ permission_id: string }>;
};

export default function Page({ params }: PageProps) {
  const { permission_id: permissionId } = use(params);
  const isCreatePage = permissionId === "create";

  const { setTitle, setFullLoading, backendClient, router } =
    useHelperContext()();
  const [defaultValue, setDefaultValue] = useState<Permission | null>();

  useEffect(() => {
    if (isCreatePage) {
      setTitle("Create Permission");
      return;
    }
    fetchDefaultValue();
  }, []);

  const fetchDefaultValue = async () => {
    setFullLoading(true);
    const response = await backendClient.getPermissionById(permissionId);
    setFullLoading(false);

    if (isErrorResponse(response)) {
      router.push("/dashboard/permission");
      return;
    }

    setTitle(response.title);
    setDefaultValue(response);
  };

  const onSubmit = async (values: Record<string, unknown>) => {
    setFullLoading(true);

    if (isCreatePage) {
      const response = await backendClient.createPermission({
        title: values.title as string ?? "",
        mapping: values.mapping as string ?? "",
      });

      setFullLoading(false);
      if (isErrorResponse(response)) {
        return;
      }
    } else {
      const response = await backendClient.updatePermission(permissionId, {
        title: values.title as string ?? "",
        mapping: values.mapping as string ?? "",
      });
      setFullLoading(false);
      if (isErrorResponse(response)) {
        return;
      }
    }
    router.push("/dashboard/permission");
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
            defaultValue: defaultValue?.title ?? "",
          },
          {
            type: "text",
            id: "mapping",
            label: "Mapping",
            required: true,
            defaultValue: defaultValue?.mapping ?? "",
          },
        ]}
        onSubmit={onSubmit}
      />
    </div>
  );
}
