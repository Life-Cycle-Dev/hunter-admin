/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import FormGroup from "@/components/form-group";
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

  const onSubmit = async (values: Record<string, unknown>) => {
    console.log(values);
  };

  useEffect(() => {
    fetchDefaultValue();
  }, []);

  const fetchDefaultValue = async () => {
    setFullLoading(true);
    const response = await backendClient.getUserById(userId);
    setFullLoading(false);

    if (isErrorResponse(response)) {
      router.push("/dashboard/user");
      return;
    }

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
            type: "text",
            id: "role",
            label: "Role",
            defaultValue: defaultValue?.role?.title ?? "User",
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
