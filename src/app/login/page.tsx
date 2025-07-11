"use client";
import { useHelperContext } from "@/components/providers/helper-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isErrorResponse } from "@/types/payload";
import { FormEvent, useRef } from "react";

export default function Page() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const { backendClient, setFullLoading, router } = useHelperContext()();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = formRef.current;
    const email = form?.email?.value ?? "";
    const password = form?.password?.value ?? "";

    setFullLoading(true);
    const response = await backendClient.login({
      email,
      password,
    });
    setFullLoading(false);

    if (isErrorResponse(response)) {
      return;
    }
    router.push("/dashboard");
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex min-h-svh w-full items-center justify-center p-6 md:p-10"
    >
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-center">
                Hunter Admin
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input id="password" type="password" required />
                </div>
                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
