"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import BusinessRuleForm from "./_components/BusinessRuleForm";
import { BusinessRuleSkeleton } from "./_components/BusinessRuleSkeleton";
import { getCreditBusinessRules } from "./actions";
import { toast } from "react-toastify";
import { CreditSetting } from "./rules";

const BusinessRulePage = () => {
  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<CreditSetting>({ baseScore: 0, rules: []});

  useEffect(() => {
    const getData = (async (token: string) => {
      setIsLoading(true);
      try {
        const { data, message, status } = await getCreditBusinessRules(token);
        if (status === "success") {
          setData(data);
        } else {
          toast.error(message);
        }
      } catch (error) {
        toast.error(error?.message);
      } finally {
        setIsLoading(false);
      }
    });

    if (sessionData?.user?.token) {
      getData(sessionData?.user?.token);
    }
  }, [sessionData?.user?.token]);

  if (isLoading || data.rules?.length === 0) {
    return <BusinessRuleSkeleton />;
  }

  return <BusinessRuleForm
    token={sessionData?.user?.token}
    initialData={data?.rules}
    baseScore={data?.baseScore}
  />
};

export default BusinessRulePage;
