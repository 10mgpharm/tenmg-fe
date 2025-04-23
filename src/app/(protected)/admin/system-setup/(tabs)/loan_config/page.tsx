"use client";

import React, { useCallback, useEffect, useState } from "react";
import InterestConfigSegment from "../../_components/InterestConfigSegment";
import LoanConfigSegment from "../../_components/LoanConfigSegment";
import requestClient from "@/lib/requestClient";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import { Spinner } from "@chakra-ui/react";

type datatype = {
  general: {
    key: string;
    value: number;
    group: string;
  }[];
  loan: {
    key: string;
    value: number;
    group: string;
  }[];
};

const LoanConfig = () => {
  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<datatype>();

  const getData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await requestClient({ token: token }).get(
        "/admin/settings/config"
      );
      if (response.status === 200) {
        setData(response.data);
      }
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  }, [token]);

  useEffect(() => {
    getData();
  }, [getData]);

  if (isLoading) {
    return (
      <div className="flex items-center mt-10 justify-center ">
        <Spinner size={"lg"} />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <InterestConfigSegment data={data?.general} refetch={() => getData()} />

      <LoanConfigSegment data={data?.loan} refetch={() => getData()} />
    </div>
  );
};

export default LoanConfig;
