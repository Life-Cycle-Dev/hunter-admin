"use client";
import { DataTable } from "@/components/data-table";
import { useHelperContext } from "@/components/providers/helper-provider";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";

export default function Index() {
  const { backendClient, setTitle } = useHelperContext()();

  useEffect(() => {
    setTitle("Applications");
  });

  return (
    <div className="mx-5">
      <DataTable
        fetchData={(page, perPage, query) =>
          backendClient.getApplicationList(page, perPage, query)
        }
        columns={[
          { key: "id", label: "ID" },
          { key: "title", label: "Title" },
          { key: "active", label: "Active" },
        ]}
        href="/dashboard/application/{}"
        navigateKey="id"
        isSearchable
        primaryButton={
          <Link href="/dashboard/application/create">
            <Button variant="default" size="sm">
              Create
            </Button>
          </Link>
        }
      />
    </div>
  );
}
