import { Kanit } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { FullLoadingProvider } from "@/components/providers/full-loading-provider";
import { AlertDialogProvider } from "@/components/providers/alert-provider";
import { HelperProvider } from "@/components/providers/helper-provider";

const kanit = Kanit({
  weight: "300",
  subsets: [`latin`, `latin-ext`, `thai`, `vietnamese`],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${kanit.className}`}>
        <Suspense fallback={<div></div>}>
          <FullLoadingProvider>
            <AlertDialogProvider>
              <HelperProvider>{children}</HelperProvider>
            </AlertDialogProvider>
          </FullLoadingProvider>
        </Suspense>
      </body>
    </html>
  );
}
