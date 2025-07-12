"use client";
import { useHelperContext } from "@/components/providers/helper-provider";
import { useEffect } from "react";

export default function Page() {
  const { setTitle } = useHelperContext()();

  useEffect(() => {
    setTitle("Create Role");
  }, [setTitle]);

  return <div className="mx-5">page</div>;
}
