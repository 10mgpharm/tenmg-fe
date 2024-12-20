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
  useDisclosure,
} from "@chakra-ui/react";
import { CiSearch } from "react-icons/ci";
import { FaChevronDown } from "react-icons/fa6";
import { MdFilterList } from "react-icons/md";
import { useSession } from "next-auth/react";
import { AdminApprovalsProps, NextAuthUserSession } from "@/types";
import { useCallback, useEffect, useState } from "react";
import requestClient from "@/lib/requestClient";
import UsersTab from "./_components/UsersTab";

const DocumentApproval = () => {
  const [type, setType] = useState<"supplier" | "vendor" | "pharmacy">(
    "supplier"
  );

  const session = useSession();
  const sessionToken = session?.data as NextAuthUserSession;
  const token = sessionToken?.user?.token;
  const [supplierData, setSupplierData] =
    useState<AdminApprovalsProps | null>();
  const [vendorData, setVendorData] = useState<AdminApprovalsProps | null>();
  const [pharmData, setPharmData] = useState<AdminApprovalsProps | null>();
  const [requestData, setRequestData] = useState<AdminApprovalsProps | null>();
  const [supplierCount, setSupplierCount] = useState<AdminApprovalsProps>();
  const [vendorCount, setVendorCount] = useState<AdminApprovalsProps>();
  const [pharmCount, setPharmCount] = useState<AdminApprovalsProps>();
  const [requestCount, setRequestCount] =
    useState<AdminApprovalsProps | null>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [pageCount, setPageCount] = useState<number>(1);
  // const [pageLimit, setPageLimit] = useState<number>(10);
  const [total, setTotal] = useState<any>("");

  const fetchRequests = useCallback(
    async (type: string, pageCount: number) => {
      try {
        setIsLoading(true);
        const response = await requestClient({ token: token }).get(
          `/admin/business/licenses?page=${pageCount}&type=${type}`
        );
        if (response.status === 200) {
          setIsLoading(false);
          if (type === "") {
            setRequestCount(response.data.data);
            setRequestData(response.data.data);
            setTotal(response.data?.meta);
          } else if (type === "Supplier") {
            setSupplierCount(response.data.data);
            setSupplierData(response.data.data);
            setTotal(response.data?.meta);
          } else if (type === "Vendor") {
            setVendorCount(response.data.data);
            setVendorData(response.data.data);
            setTotal(response.data?.meta);
          } else if (type === "Pharmacy") {
            setPharmCount(response.data.data);
            setPharmData(response.data.data);
            setTotal(response.data?.meta);
          }
        }
      } catch (error) {
        setIsLoading(false);
        console.error(error);
      }
    },
    [token, pageCount, type]
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
    if (index === 1) {
      fetchRequests("Supplier", 1);
      setVendorData(null);
      setPharmData(null);
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
    } else {
      fetchRequests("", 1);
      setVendorData(null);
      setPharmData(null);
      setSupplierData(null);
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
          <Menu>
            <MenuButton className="bg-primary-500 font-medium text-white p-2 px-5 rounded-md">
              <div className="flex items-center gap-2">
                Actions
                <FaChevronDown className="w-4 h-4 text-white" />
              </div>
            </MenuButton>
            <MenuList>
              <MenuItem
                onClick={() => {
                  ("");
                }}
              >
                Accept All
              </MenuItem>
              <MenuItem
                color="red.500"
                onClick={() => {
                  ("");
                }}
              >
                Decline Request
              </MenuItem>
            </MenuList>
          </Menu>
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
                {requestCount?.meta.total || 0}
              </p>
            </div>
          </Tab>
          <Tab
            _selected={{ color: "white", bg: "#1A70B8", borderRadius: "10px" }}
          >
            <div className="flex items-center gap-3">
              <Text>Suppliers</Text>
              <p className="bg-purple-50 text-purple-500 py-0.5 px-1.5 rounded-full text-sm">
                {supplierCount?.meta.total || 0}
              </p>
            </div>
          </Tab>
          <Tab
            _selected={{ color: "white", bg: "#1A70B8", borderRadius: "10px" }}
          >
            <div className="flex items-center gap-3">
              <Text>Pharmacies</Text>
              <p className="bg-green-50 text-green-500 py-0.5 px-1.5 rounded-full text-sm">
                {pharmCount?.meta.total || 0}
              </p>
            </div>
          </Tab>
          <Tab
            _selected={{ color: "white", bg: "#1A70B8", borderRadius: "10px" }}
          >
            <div className="flex items-center gap-3">
              <Text>Vendors</Text>
              <p className="bg-orange-50 text-orange-500 py-0.5 px-1.5 rounded-full text-sm">
                {vendorCount?.meta.total || 0}
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
              type="Suppliers"
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
              type="Vendors"
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
