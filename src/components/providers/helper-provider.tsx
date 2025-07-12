"use client";

import { BackendClient } from "@/lib/request";
import { initUserType, isErrorResponse, UserType } from "@/types/payload";
import { useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAlertContext } from "./alert-provider";
import { useFullLoadingContext } from "./full-loading-provider";

interface HelperContextType {
  setAlert: (
    title: string,
    text: string,
    action: undefined | (() => void),
    canCancel: boolean,
  ) => void;
  setFullLoading: (value: boolean) => void;
  backendClient: BackendClient;
  router: ReturnType<typeof useRouter>;
  userData: UserType;
  title: string;
  setTitle: (value: string) => void;
}

const HelperContext = createContext<() => HelperContextType>(() => {
  return {
    setAlert: () => {},
    setFullLoading: () => {},
    backendClient: new BackendClient(() => {}),
    router: useRouter(),
    userData: initUserType,
    title: "Hunter App",
    setTitle: () => {},
  };
});

export function HelperProvider({ children }: { children: ReactNode }) {
  const setAlert = useAlertContext();
  const setFullLoading = useFullLoadingContext();
  const router = useRouter();
  const [userData, setUserData] = useState<UserType>(initUserType);
  const [title, setTitle] = useState<string>("");

  useEffect(() => {
    const fetchUserData = async () => {
      const backendClient = new BackendClient(setAlert);
      const response = await backendClient.getUserInfo();
      const isError = isErrorResponse(response);

      if (isError) {
        return;
      }

      if (window.location.pathname === "/") {
        if (response.id !== "") {
          router.push("/dashboard");
        } else {
          router.push("/login");
        }
      } else if (window.location.pathname === "/login") {
        if (response.id !== "") {
          router.push("/dashboard");
        }
      } else if (response.id === "") {
        router.push("/login");
      }
      setUserData(response);
    };

    fetchUserData();
  }, [setAlert, router]);

  const useHelper = useCallback(
    () => ({
      setAlert,
      setFullLoading,
      backendClient: new BackendClient(setAlert),
      router,
      userData,
      setTitle: onSetTitle,
      title,
    }),
    [setAlert, setFullLoading, router, userData, title],
  );

  const onSetTitle = (text: string) => {
    if (!text) {
      document.title = "Hunter App";
      setTitle("Hunter App");
    }
    document.title = "Hunter - " + text;
    setTitle(text);
  };

  return (
    <HelperContext.Provider value={useHelper}>
      {children}
    </HelperContext.Provider>
  );
}

export const useHelperContext = () => useContext(HelperContext);
