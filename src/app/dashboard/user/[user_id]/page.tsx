/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import FormGroup, { SelectOption } from "@/components/form-group";
import { useHelperContext } from "@/components/providers/helper-provider";
import { GetUserByIdResponse, isErrorResponse } from "@/types/payload";
import { use, useEffect, useState } from "react";

type PageProps = {
  params: Promise<{ user_id: string }>;
};

export default function Page({ params }: PageProps) {
  const { user_id: userId } = use(params);

  const { setTitle, setFullLoading, backendClient, router } =
    useHelperContext()();
  const [defaultValue, setDefaultValue] =
    useState<GetUserByIdResponse | null>();
  const [roles, setRoles] = useState<SelectOption[]>([]);

  const onSubmit = async (values: Record<string, unknown>) => {
    setFullLoading(true);
    const response = await backendClient.updateUserById(userId, {
      name: values.name as string,
      email: values.email as string,
      is_developer: values.is_developer as boolean,
      is_email_verified: values.is_email_verified as boolean,
      role_id: values.role_id as string,
    });
    setFullLoading(false);
    if (isErrorResponse(response)) {
      router.push("/dashboard/user");
      return;
    }
    fetchDefaultValue();
  };

  useEffect(() => {
    fetchDefaultValue();
  }, []);

  const fetchDefaultValue = async () => {
    setFullLoading(true);

    const roles = await backendClient.getRoleList(1, 1000, "");
    if (isErrorResponse(roles)) {
      router.push("/dashboard/user");
      return;
    }

    const roleOptions = roles.data.map((role) => {
      return {
        label: role.title,
        value: role.id,
      };
    });

    const response = await backendClient.getUserById(userId);
    setFullLoading(false);

    if (isErrorResponse(response)) {
      router.push("/dashboard/user");
      return;
    }

    setRoles(roleOptions);
    setTitle(response.name);
    setDefaultValue(response);
  };

  return (
    <div className="mx-5">
      <FormGroup
        items={[
          {
            type: "text",
            id: "name",
            label: "Name",
            defaultValue: defaultValue?.name,
          },
          {
            type: "text",
            id: "email",
            label: "Email",
            defaultValue: defaultValue?.email,
          },
          {
            type: "select",
            options: roles,
            id: "role_id",
            label: "Role",
            defaultValue: defaultValue?.role?.id,
          },
          {
            type: "switch",
            id: "is_developer",
            label: "Is developer?",
            defaultValue: defaultValue?.is_developer,
          },
          {
            type: "switch",
            id: "is_email_verified",
            label: "Is email verified?",
            defaultValue: defaultValue?.is_email_verified,
          },
        ]}
        onSubmit={onSubmit}
      />
    </div>
  );
}
