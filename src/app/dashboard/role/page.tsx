"use client";
import { DataTable } from "@/components/data-table";
import { useHelperContext } from "@/components/providers/helper-provider";
import { useEffect } from "react";

export default function Page() {
  const { backendClient, setTitle } = useHelperContext()();

  useEffect(() => {
    setTitle("Role");
  });

  return (
    <div className="mx-5">
      <DataTable
        fetchData={(page, perPage, query) =>
          backendClient.getRoleList(page, perPage, query)
        }
        columns={[
          { key: "mapping", label: "Mapping" },
          { key: "title", label: "Title" },
          { key: "id", label: "ID" },
        ]}
        href="/dashboard/permission/{}"
        navigateKey="id"
        isSearchable
      />
    </div>
  );
}
