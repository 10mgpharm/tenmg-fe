import React from "react";
import { OverviewCard } from "./overviewCard";
import totalPattern from "@public/assets/images/bgPattern.svg";
import orderPattern from "@public/assets/images/orderPattern.svg";
import productPattern from "@public/assets/images/productpatterns.svg";
import Link from "next/link";
import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { transactionData } from "@/data/mockdata";
import DataTable from "./table";
import { Awaiting_column } from "./colunms/awaiting_column";
import { Completed_column } from "./colunms/completed_column";
import { Transaction_column } from "./colunms/transaction_column";
import TransactionDetails from "./transactionDetails";
import InitiatePayout from "./initiate_payout";

const LoanWallet = () => {
  const awaiting = transactionData.filter((item) => item.type === "Awaiting");
  const completed = transactionData.filter((item) => item.type === "Completed");
  const history = transactionData.filter((item) => item.type === "History");

  const [openDetails, setOpenDetails] = React.useState(false);
  const [openPayout, setOpenPayout] = React.useState(false);
  const [openCompleted, setOpenCompleted] = React.useState(false);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-[10px] md:gap-4 mt-5 ">
        <OverviewCard
          title="Total Amount from Lenders"
          value="₦5,600"
          fromColor="from-[#53389E]"
          toColor="to-[#7F56D9]"
          image={totalPattern}
        />
        <OverviewCard
          title="Total Payout for Vendors"
          value="2,600"
          fromColor="from-[#DC6803]"
          toColor="to-[#DC6803]"
          image={orderPattern}
        />
        <OverviewCard
          title="Wallet Balance"
          value="₦50,000"
          fromColor="from-[#E31B54]"
          toColor="to-[#E31B54]"
          image={productPattern}
        />
      </div>

      <div className="flex items-center justify-between mt-5">
        <h3 className="font-medium text-[18px] ">Transactions</h3>

        <Link
          href={"/vendors/wallets/loan-wallet"}
          className="text-gray-600 text-sm px-4 py-2 font-medium bg-white border border-[#D0D5DD] rounded-md"
        >
          View all
        </Link>
      </div>

      <Tabs variant={"unstyled"} className="mt-5">
        <TabList className="flex items-center gap-3 max-sm:overflow-x-scroll no-scrollbar">
          <Tab
            _selected={{ color: "white", bg: "#1A70B8" }}
            className="bg-gray-100  text-[15px] text-gray-700 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <Text className="text-nowrap">Awaiting Payout</Text>
              <p className="bg-purple-50 text-purple-500 py-0.5 px-1.5 rounded-full text-sm">
                {awaiting?.length}
              </p>
            </div>
          </Tab>
          <Tab
            _selected={{ color: "white", bg: "#1A70B8" }}
            className="bg-gray-100  text-[15px] text-gray-700 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <Text className="text-nowrap">Completed Payout</Text>
              <p className="bg-green-50 text-green-500 py-0.5 px-1.5 rounded-full text-sm">
                {completed?.length}
              </p>
            </div>
          </Tab>
          <Tab
            _selected={{ color: "white", bg: "#1A70B8" }}
            className="bg-gray-100  text-[15px] text-gray-700 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <Text className="text-nowrap">Transaction History</Text>
              <p className="bg-orange-50 text-orange-500 py-0.5 px-1.5 rounded-full text-sm">
                {history?.length}
              </p>
            </div>
          </Tab>
        </TabList>

        <TabPanels className="mt-3">
          <TabPanel className="!p-0">
            <DataTable
              data={awaiting}
              column={Awaiting_column(
                "loan",
                setOpenDetails,
                setOpenPayout,
                setOpenCompleted
              )}
              hasPagination={false}
              isLoading={false}
            />
          </TabPanel>

          <TabPanel className="!p-0">
            <DataTable
              data={completed}
              column={Completed_column(
                "loan",
                setOpenDetails,
                setOpenPayout,
                setOpenCompleted
              )}
              hasPagination={false}
              isLoading={false}
            />
          </TabPanel>

          <TabPanel className="!p-0">
            <DataTable
              data={history}
              column={Transaction_column(
                "loan",
                setOpenDetails,
                setOpenPayout,
                setOpenCompleted
              )}
              hasPagination={false}
              isLoading={false}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Side sheets */}
      {openDetails && (
        <TransactionDetails
          isOpen={openDetails}
          onClose={() => setOpenDetails(false)}
        />
      )}

      {openPayout && (
        <InitiatePayout
          isOpen={openPayout}
          onClose={() => setOpenPayout(false)}
        />
      )}
    </div>
  );
};

export default LoanWallet;
