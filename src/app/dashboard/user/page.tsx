"use client";
import { DataTable } from "@/components/data-table";
import { useHelperContext } from "@/components/providers/helper-provider";
import { useEffect } from "react";

export default function Page() {
  const { backendClient, setTitle } = useHelperContext()();

  useEffect(() => {
    setTitle("Users");
  });

  return (
    <div className="mx-5">
      <DataTable
        fetchData={(page, perPage, query) =>
          backendClient.getUserList(page, perPage, query)
        }
        columns={[
          { key: "id", label: "ID" },
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "role", label: "Role" },
          { key: "is_developer", label: "Is developer?" },
          { key: "is_email_verified", label: "Is email verified?" },
        ]}
        href="/dashboard/user/{}"
        navigateKey="id"
        isSearchable
      />
    </div>
  );
}
