"use client";
import {
  Checkbox,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { CiSearch } from "react-icons/ci";
import { MdFilterList } from "react-icons/md";
import { useSession } from "next-auth/react";
import { AdminApprovalsProps, NextAuthUserSession } from "@/types";
import { useCallback, useEffect, useState } from "react";
import requestClient from "@/lib/requestClient";
import UsersTab from "./_components/UsersTab";

// interface ResponseData {
//   data: AdminApprovalsProps;
//   stats: { type: string; total: number }[];
// }

const DocumentApproval = () => {
  const [type, setType] = useState<"supplier" | "vendor" | "pharmacy" | "">("");
  const { data: sessionData } = useSession();
  const sessionToken = sessionData as NextAuthUserSession;
  const token = sessionToken?.user?.token;

  const [requestData, setRequestData] = useState<AdminApprovalsProps | null>(
    null
  );
  const [supplierData, setSupplierData] = useState<AdminApprovalsProps | null>(
    null
  );
  const [vendorData, setVendorData] = useState<AdminApprovalsProps | null>(
    null
  );
  const [pharmData, setPharmData] = useState<AdminApprovalsProps | null>(null);

  const [requestTotal, setRequestTotal] = useState<number>(0);
  const [supplierTotal, setSupplierTotal] = useState<number>(0);
  const [vendorTotal, setVendorTotal] = useState<number>(0);
  const [pharmTotal, setPharmTotal] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pageCount, setPageCount] = useState<number>(1);

  const fetchRequests = useCallback(
    async (requestType: string, page: number) => {
      if (!token) return;
      try {
        setIsLoading(true);
        const response = await requestClient({ token }).get(
          `/admin/business/licenses?page=${page}${
            requestType ? `&type=${requestType}` : ""
          }`
        );

        if (response.status === 200) {
          const { data } = response.data;

          if (requestType === "") {
            setRequestData(data);
            setRequestTotal(data.meta.total);
          } else if (requestType === "Supplier") {
            setSupplierData(data);
            setSupplierTotal(data.meta.total);
          } else if (requestType === "Pharmacy") {
            setPharmData(data);
            setPharmTotal(data.meta.total);
          } else if (requestType === "Vendor") {
            setVendorData(data);
            setVendorTotal(data.meta.total);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    if (!token) return;
    fetchRequests("", pageCount);
    fetchRequests("Supplier", pageCount);
    fetchRequests("Pharmacy", pageCount);
    fetchRequests("Vendor", pageCount);
  }, [fetchRequests, token, pageCount]);

  const handleTabsChange = (index: number) => {
    setPageCount(1);

    if (index === 0) {
      fetchRequests("", 1);
      setSupplierData(null);
      setPharmData(null);
      setVendorData(null);
    } else if (index === 1) {
      fetchRequests("Supplier", 1);
      setPharmData(null);
      setVendorData(null);
      setRequestData(null);
    } else if (index === 2) {
      fetchRequests("Pharmacy", 1);
      setSupplierData(null);
      setVendorData(null);
      setRequestData(null);
    } else if (index === 3) {
      fetchRequests("Vendor", 1);
      setSupplierData(null);
      setPharmData(null);
      setRequestData(null);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between">
        <h3 className="font-semibold text-2xl">New Approvals</h3>
        <div className="mb-4 flex items-center gap-3">
          <div className="border border-gray-300 rounded-md flex items-center gap-3 px-3 py-2 w-[350px]">
            <CiSearch className="w-5 h-5 text-gray-700" />
            <input
              type="text"
              placeholder="Search for a user"
              className="outline-none flex-1 placeholder:text-gray-400 bg-transparent"
            />
            <Menu>
              <MenuButton>
                <MdFilterList className="w-5 h-5 text-primary-600" />
              </MenuButton>
              <MenuList>
                <MenuItem>
                  <Checkbox>Suspended</Checkbox>
                </MenuItem>
                <MenuItem>
                  <Checkbox>Active</Checkbox>
                </MenuItem>
                <MenuItem>
                  <Checkbox>Pending</Checkbox>
                </MenuItem>
              </MenuList>
            </Menu>
          </div>
        </div>
      </div>
      <Tabs onChange={handleTabsChange} variant={"unstyled"}>
        <TabList>
          <Tab
            _selected={{ color: "white", bg: "#1A70B8", borderRadius: "10px" }}
          >
            <div className="flex items-center gap-3">
              <Text>All</Text>
              <p className="bg-purple-50 text-purple-500 py-0.5 px-1.5 rounded-full text-sm">
                {requestTotal || 0}
              </p>
            </div>
          </Tab>
          <Tab
            _selected={{ color: "white", bg: "#1A70B8", borderRadius: "10px" }}
          >
            <div className="flex items-center gap-3">
              <Text>Suppliers</Text>
              <p className="bg-purple-50 text-purple-500 py-0.5 px-1.5 rounded-full text-sm">
                {supplierTotal || 0}
              </p>
            </div>
          </Tab>
          <Tab
            _selected={{ color: "white", bg: "#1A70B8", borderRadius: "10px" }}
          >
            <div className="flex items-center gap-3">
              <Text>Pharmacies</Text>
              <p className="bg-green-50 text-green-500 py-0.5 px-1.5 rounded-full text-sm">
                {pharmTotal || 0}
              </p>
            </div>
          </Tab>
          <Tab
            _selected={{ color: "white", bg: "#1A70B8", borderRadius: "10px" }}
          >
            <div className="flex items-center gap-3">
              <Text>Vendors</Text>
              <p className="bg-orange-50 text-orange-500 py-0.5 px-1.5 rounded-full text-sm">
                {vendorTotal || 0}
              </p>
            </div>
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel px={0}>
            <UsersTab
              isLoading={isLoading}
              data={requestData}
              type=""
              pageCount={pageCount}
              setPageCount={setPageCount}
              fetchTeamUser={fetchRequests}
            />
          </TabPanel>
          <TabPanel>
            <UsersTab
              isLoading={isLoading}
              data={supplierData}
              type="Supplier"
              pageCount={pageCount}
              setPageCount={setPageCount}
              fetchTeamUser={fetchRequests}
            />
          </TabPanel>
          <TabPanel>
            <UsersTab
              isLoading={isLoading}
              data={pharmData}
              type="Pharmacy"
              pageCount={pageCount}
              setPageCount={setPageCount}
              fetchTeamUser={fetchRequests}
            />
          </TabPanel>
          <TabPanel>
            <UsersTab
              isLoading={isLoading}
              data={vendorData}
              type="Vendor"
              pageCount={pageCount}
              setPageCount={setPageCount}
              fetchTeamUser={fetchRequests}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default DocumentApproval;
