"use client";
import { DataTable } from "@/components/data-table";
import { useHelperContext } from "@/components/providers/helper-provider";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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
          { key: "id", label: "ID" },
          { key: "mapping", label: "Mapping" },
          { key: "title", label: "Title" },
        ]}
        href="/dashboard/role/{}"
        navigateKey="id"
        isSearchable
        primaryButton={
          <Link href="/dashboard/role/create">
            <Button variant="default" size="sm">
              Create
            </Button>
          </Link>
        }
      />
    </div>
  );
}
