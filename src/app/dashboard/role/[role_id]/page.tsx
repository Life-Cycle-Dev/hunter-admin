/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import FormGroup, { SelectOption } from "@/components/form-group";
import { useHelperContext } from "@/components/providers/helper-provider";
import { isErrorResponse, Role } from "@/types/payload";
import { use, useEffect, useState } from "react";

type PageProps = {
  params: Promise<{ role_id: string }>;
};

export default function Page({ params }: PageProps) {
  const { role_id: roleId } = use(params);
  const isCreatePage = roleId === "create";

  const { setTitle, setFullLoading, backendClient, router } =
    useHelperContext()();
  const [defaultRoleValue, setDefaultRoleValue] = useState<Role | null>();
  const [defaultPermissionIds, setDefaultPermissionIds] = useState<string[]>(
    [],
  );
  const [permissionOptions, setPermissionOptions] = useState<SelectOption[]>(
    [],
  );

  useEffect(() => {
    if (isCreatePage) {
      fetchPermissions();
      setTitle("Create Role");
      return;
    }
    fetchDefaultValue();
  }, []);

  const onSubmit = async (values: Record<string, unknown>) => {
    setFullLoading(true);

    if (isCreatePage) {
      const response = await backendClient.createRole({
        title: (values.title as string) ?? "",
        mapping: (values.mapping as string) ?? "",
        permission_ids: (values.permission_ids as string[]) ?? [],
      });

      setFullLoading(false);
      if (isErrorResponse(response)) {
        return;
      }
    } else {
      const response = await backendClient.updateRole(roleId, {
        title: (values.title as string) ?? "",
        mapping: (values.mapping as string) ?? "",
        permission_ids: (values.permission_ids as string[]) ?? [],
      });

      setFullLoading(false);
      if (isErrorResponse(response)) {
        return;
      }
    }
    router.push("/dashboard/role");
  };

  const fetchDefaultValue = async () => {
    setFullLoading(true);
    const response = await backendClient.getRoleById(roleId);
    await fetchPermissions();
    setFullLoading(false);

    if (isErrorResponse(response)) {
      router.push("/dashboard/permission");
      return;
    }

    setTitle(response.role.title);
    setDefaultRoleValue(response.role);
    setDefaultPermissionIds(
      response.permissions.map((permission) => permission.id),
    );
  };

  const fetchPermissions = async () => {
    const permissions = await backendClient.getPermissionList(1, 1000, "");

    if (isErrorResponse(permissions)) {
      router.push("/dashboard/role");
      return;
    }

    const permissionOptions = permissions.data.map((permission) => {
      return {
        label: `${permission.title} (${permission.mapping})`,
        value: permission.id,
      };
    });
    setPermissionOptions(permissionOptions);
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
            defaultValue: defaultRoleValue?.title ?? "",
          },
          {
            type: "text",
            id: "mapping",
            label: "Mapping",
            required: true,
            defaultValue: defaultRoleValue?.mapping ?? "",
          },
          {
            type: "checkbox",
            id: "permission_ids",
            label: "Permissions",
            options: permissionOptions,
            defaultValue: defaultPermissionIds ?? [],
          },
        ]}
        onSubmit={onSubmit}
      />
    </div>
  );
}
