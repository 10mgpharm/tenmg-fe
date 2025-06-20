"use client";

import React, { useCallback, useEffect, useState } from "react";
import requestClient from "@/lib/requestClient";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import { Spinner } from "@chakra-ui/react";
import BusinessRuleForm, { BusinessRuleItem, RuleCondition, RuleOperator } from "../../_components/BusinessRuleFormSegment";

const initialData: BusinessRuleItem[] = [
  {
    id: 1,
    name: "totalTransactionVolume",
    active: true,
    condition: RuleCondition.GreaterThanOrEqual,
    category_id: 2,
    description: "Total sum amount of all purchases done",
    score_weight: 10,
    compare_value: 5000000,
    logical_operator: RuleOperator.GreaterThanOrEqual,
  },
  {
    id: 2,
    name: "averageTransactionVolume",
    active: true,
    condition: RuleCondition.GreaterThanOrEqual,
    category_id: 2,
    description:
      "Average sum amount of all purchases done i.e totalTransactionVolume / noOfTransactingMonths",
    score_weight: 10,
    compare_value: 500000,
    logical_operator: RuleOperator.GreaterThanOrEqual,
  },
  {
    id: 3,
    name: "totalTransactionCount",
    active: true,
    condition: RuleCondition.GreaterThan,
    category_id: 2,
    description: "Total count of all purchases done",
    score_weight: 10,
    compare_value: 100,
    logical_operator: RuleOperator.GreaterThan,
  },
  {
    id: 4,
    name: "noOfTransactingMonths",
    active: true,
    condition: RuleCondition.GreaterThanOrEqual,
    category_id: 2,
    description:
      "Total count of how many months in the txn history e.g 6 i.e 6 Months",
    score_weight: 10,
    compare_value: 6,
    logical_operator: RuleOperator.GreaterThanOrEqual,
  },
  {
    id: 5,
    name: "listOfTransactingMonths",
    active: true,
    condition: RuleCondition.None, // fallback/default since null not allowed
    category_id: 2,
    description:
      "Array list of all months identified in the transaction [“June, 2024”, “July 2024”, “August 2024”,......]",
    score_weight: 10,
    compare_value: 0,
    logical_operator: RuleOperator.None, // fallback/default
  },
  {
    id: 6,
    name: "noOfOmmitedMonths",
    active: true,
    condition: RuleCondition.Equals,
    category_id: 2,
    description: "Months customer did not perform any transaction",
    score_weight: 10,
    compare_value: 0,
    logical_operator: RuleOperator.Equals,
  },
  {
    id: 7,
    name: "highestTransactingMonth",
    active: true,
    condition: RuleCondition.GreaterThanOrEqual,
    category_id: 2,
    description: "Object of month name and year, amount purchase",
    score_weight: 10,
    compare_value: 200000,
    logical_operator: RuleOperator.GreaterThanOrEqual,
  },
  {
    id: 8,
    name: "lowestTransactingMonth",
    active: true,
    condition: RuleCondition.GreaterThanOrEqual,
    category_id: 2,
    description: "Object of month name and year, amount purchase",
    score_weight: 10,
    compare_value: 20000,
    logical_operator: RuleOperator.GreaterThanOrEqual,
  },
  {
    id: 21,
    name: "noOfLateRepayments",
    active: true,
    condition: RuleCondition.LessThan,
    category_id: 1,
    description: "Count of all late repayments performed by customer",
    score_weight: 10,
    compare_value: 5,
    logical_operator: RuleOperator.LessThan,
  },
];

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

const BusinessRulePage = () => {
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

  return <BusinessRuleForm initialData={initialData} />
};

export default BusinessRulePage;
