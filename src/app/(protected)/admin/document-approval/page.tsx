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
import { MemberDataProp, NextAuthUserSession } from "@/types";
import { useCallback, useEffect, useState } from "react";
import requestClient from "@/lib/requestClient";
import SupplierTab from "./_components/UsersTab";
import UsersTab from "./_components/UsersTab";

const DocumentApproval = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [type, setType] = useState<"supplier" | "vendor" | "pharmacy">(
    "supplier"
  );
  const {
    isOpen: isOpenPharm,
    onClose: onClosePharm,
    onOpen: onOpenPharm,
  } = useDisclosure();
  const {
    isOpen: isOpenVendor,
    onClose: onCloseVendor,
    onOpen: onOpenVendor,
  } = useDisclosure();

  const session = useSession();
  const sessionToken = session?.data as NextAuthUserSession;
  const token = sessionToken?.user?.token;
  const [supplierData, setSupplierData] = useState<MemberDataProp | null>();
  const [vendorData, setVendorData] = useState<MemberDataProp | null>();
  const [pharmData, setPharmData] = useState<MemberDataProp | null>();
  const [supplierCount, setSupplierCount] = useState<MemberDataProp>();
  const [vendorCount, setVendorCount] = useState<MemberDataProp>();
  const [pharmCount, setPharmCount] = useState<MemberDataProp>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [pageCount, setPageCount] = useState<number>(1);
  // const [pageLimit, setPageLimit] = useState<number>(10);
  const [total, setTotal] = useState<any>("");

  const fetchTeamUser = useCallback(
    async (type: string, pageCount: number) => {
      try {
        setIsLoading(true);
        const response = await requestClient({ token: token }).get(
          `/admin/business/licenses?page=${pageCount}&type=${type}`
        );
        if (response.status === 200) {
          setIsLoading(false);
          if (type === "Supplier") {
            setSupplierCount(response.data.data);
            setSupplierData(response.data.data);
            setTotal(response.data?.meta);
          } else if (type === "Vendor") {
            setVendorCount(response.data.data);
            setVendorData(response.data.data);
            setTotal(response.data?.meta);
          } else if (type === "Pharmacies") {
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
    fetchTeamUser("Supplier", pageCount);
    fetchTeamUser("Pharmacies", pageCount);
    fetchTeamUser("Vendor", pageCount);
  }, [fetchTeamUser, token, pageCount]);

  const handleTabsChange = (index: number) => {
    setPageCount(1);
    if (index === 1) {
      fetchTeamUser("Pharmacies", 1);
      setVendorData(null);
      setSupplierData(null);
    } else if (index === 2) {
      fetchTeamUser("Vendor", 1);
      setSupplierData(null);
      setPharmData(null);
    } else {
      fetchTeamUser("Supplier", 1);
      setVendorData(null);
      setPharmData(null);
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
                {supplierCount?.meta.total || 0}
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
              data={supplierData}
              type="All"
              pageCount={pageCount}
              setPageCount={setPageCount}
            />
          </TabPanel>
          <TabPanel>
            <UsersTab
              isLoading={isLoading}
              data={pharmData}
              type="Suppliers"
              pageCount={pageCount}
              setPageCount={setPageCount}
            />
          </TabPanel>
          <TabPanel>
            <UsersTab
              isLoading={isLoading}
              data={pharmData}
              type="Pharmacies"
              pageCount={pageCount}
              setPageCount={setPageCount}
            />
          </TabPanel>
          <TabPanel>
            <UsersTab
              isLoading={isLoading}
              data={vendorData}
              type="Vendors"
              pageCount={pageCount}
              setPageCount={setPageCount}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default DocumentApproval;
