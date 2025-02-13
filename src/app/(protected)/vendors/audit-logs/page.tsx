"use client";
import { CiFilter } from "react-icons/ci"
import SearchInput from "../_components/SearchInput"
import { useState } from "react";

const AuditLogs = () => {

    const [globalFilter, setGlobalFilter] = useState<string>("");

  return (
    <div className="p-8">
      <h3 className="font-semibold text-2xl">Loan Repayment</h3>
      <div className="flex justify-between">
        <div className="mb-5">
          <div className="flex items-center gap-3 mt-5">
            <SearchInput
              placeholder="Search for a loan"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
            <div
              // onClick={onOpenFilter}
              className="border cursor-pointer border-gray-300 p-2 rounded-md flex items-center gap-2"
            >
              <CiFilter className="w-5 h-5" />
              <p className="text-gray-500 font-medium">Search</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuditLogs