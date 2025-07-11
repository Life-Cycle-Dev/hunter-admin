import "./globals.css";
import { Suspense } from "react";
import { FullLoadingProvider } from "@/components/providers/full-loading-provider";
import { AlertDialogProvider } from "@/components/providers/alert-provider";
import { HelperProvider } from "@/components/providers/helper-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
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
