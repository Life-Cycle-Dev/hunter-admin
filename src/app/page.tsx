/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useHelperContext } from "@/components/providers/helper-provider";
import { useEffect } from "react";

export default function Home() {
  const { router } = useHelperContext()();
  
  useEffect(() => {
    router.push("/dashboard/application")
  }, []);

  return <div></div>;
}
