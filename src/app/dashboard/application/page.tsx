"use client";
import React, { useEffect } from "react";
import { DataTable } from "@/components/data-table";
import { useHelperContext } from "@/components/providers/helper-provider";

export default function Index() {
  const { backendClient, setTitle } = useHelperContext()();

  useEffect(() => {
    setTitle("Applications")
  })

  return (
    <div className="mx-5">
      <DataTable
        fetchData={(page, perPage, query) =>
          backendClient.getApplicationList(page, perPage, query)
        }
        columns={[
          { key: "title", label: "Title" },
          { key: "active", label: "Active" },
          { key: "id", label: "ID" },
        ]}
        href="/dashboard/application/{}"
        navigateKey="id"
        isSearchable
      />
    </div>
  );
}
