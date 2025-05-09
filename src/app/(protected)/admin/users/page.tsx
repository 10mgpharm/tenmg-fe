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
import AddNewDrawer from "./_components/AddNewDrawer";
import SupplierTab from "./_components/SupplierTab";
import { useSession } from "next-auth/react";
import { MemberDataProp, NextAuthUserSession } from "@/types";
import { useCallback, useEffect, useState } from "react";
import requestClient from "@/lib/requestClient";
import { useDebouncedValue } from "@/utils/debounce";
import LenderTab from "./_components/LenderTab";

const Users = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [type, setType] = useState<
    "supplier" | "vendor" | "pharmacy" | "lender"
  >("supplier");
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
  const {
    isOpen: isOpenLender,
    onClose: onCloseLender,
    onOpen: onOpenLender,
  } = useDisclosure();

  const session = useSession();
  const sessionToken = session?.data as NextAuthUserSession;
  const token = sessionToken?.user?.token;
  const [supplierData, setSupplierData] = useState<MemberDataProp | null>();
  const [vendorData, setVendorData] = useState<MemberDataProp | null>();
  const [pharmData, setPharmData] = useState<MemberDataProp | null>();
  const [lenderData, setLenderData] = useState<MemberDataProp | null>();
  const [supplierCount, setSupplierCount] = useState<MemberDataProp>();
  const [vendorCount, setVendorCount] = useState<MemberDataProp>();
  const [pharmCount, setPharmCount] = useState<MemberDataProp>();
  const [lenderCount, setLenderCount] = useState<MemberDataProp>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const [total, setTotal] = useState<any>("");
  const [pageCount, setPageCount] = useState<number>(1);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  const debouncedSearch = useDebouncedValue(globalFilter, 500);

  const handleCheckboxChange = (status: any) => {
    setSelectedStatuses((prevStatuses) =>
      prevStatuses.includes(status)
        ? prevStatuses.filter((item) => item !== status)
        : [...prevStatuses, status]
    );
  };

  const fetchTeamUser = useCallback(
    async (type: string, pageCount: number) => {
      try {
        setIsLoading(true);
        const query = `/admin/users?page=${pageCount}&type=${type}&status=${selectedStatuses.join(
          ","
        )}&user=${debouncedSearch}`;

        const response = await requestClient({ token: token }).get(query);
        if (response.status === 200) {
          setIsLoading(false);
          if (type === "supplier") {
            setSupplierCount(response.data.data);
            setSupplierData(response.data.data);
            setTotal(response.data?.meta);
          } else if (type === "vendor") {
            setVendorCount(response.data.data);
            setVendorData(response.data.data);
            setTotal(response.data?.meta);
          } else if (type === "pharmacy") {
            setPharmCount(response.data.data);
            setPharmData(response.data.data);
            setTotal(response.data?.meta);
          } else if (type === "lender") {
            setLenderCount(response.data.data);
            setLenderData(response.data.data);
            setTotal(response.data?.meta);
          }
        }
      } catch (error) {
        setIsLoading(false);
        console.error(error);
      }
    },
    [selectedStatuses, debouncedSearch, token]
  );

  useEffect(() => {
    if (!token) return;
    fetchTeamUser("supplier", pageCount);
    fetchTeamUser("pharmacy", pageCount);
    fetchTeamUser("vendor", pageCount);
    fetchTeamUser("lender", pageCount);
  }, [fetchTeamUser, token, pageCount]);

  const handleTabsChange = (index: number) => {
    setPageCount(1);
    if (index === 1) {
      fetchTeamUser("pharmacy", 1);
      setVendorData(null);
      setSupplierData(null);
      setLenderData(null);
    } else if (index === 2) {
      fetchTeamUser("vendor", 1);
      setSupplierData(null);
      setPharmData(null);
      setLenderData(null);
    } else if (index === 3) {
      fetchTeamUser("lender", 1);
      setSupplierData(null);
      setPharmData(null);
      setVendorData(null);
    } else {
      fetchTeamUser("supplier", 1);
      setVendorData(null);
      setPharmData(null);
      setLenderData(null);
    }
  };

  return (
    <div className="p-8">
      <div className="flex flex-col justify-between">
        <h3 className="font-semibold text-2xl">Users</h3>
        <div className="mb-4 flex items-center gap-3 flex-wrap">
          <div className="border border-gray-300 rounded-md flex flex-wrap items-center gap-3 px-3 py-2 w-[350px]">
            <CiSearch className="w-5 h-5 text-gray-700" />
            <input
              type="text"
              placeholder="Search for a user"
              className="outline-none flex-1 placeholder:text-gray-400 bg-transparent"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
            <Menu>
              <MenuButton>
                <MdFilterList className="w-5 h-5 text-primary-600" />
              </MenuButton>
              <MenuList>
                <MenuItem>
                  <Checkbox
                    isChecked={selectedStatuses.includes("suspended")}
                    onChange={() => handleCheckboxChange("suspended")}
                  >
                    Suspended
                  </Checkbox>
                </MenuItem>
                <MenuItem>
                  <Checkbox
                    isChecked={selectedStatuses.includes("active")}
                    onChange={() => handleCheckboxChange("active")}
                  >
                    Active
                  </Checkbox>
                </MenuItem>
                <MenuItem>
                  <Checkbox
                    isChecked={selectedStatuses.includes("inactive")}
                    onChange={() => handleCheckboxChange("inactive")}
                  >
                    Pending
                  </Checkbox>
                </MenuItem>
              </MenuList>
            </Menu>
          </div>
          <Menu>
            <MenuButton className="bg-primary-500 font-medium text-white p-2 px-5 rounded-md">
              <div className="flex items-center gap-2">
                Add New
                <FaChevronDown className="w-4 h-4 text-white" />
              </div>
            </MenuButton>
            <MenuList>
              <MenuItem
                onClick={() => {
                  setType("supplier");
                  onOpen();
                }}
              >
                Supplier
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setType("pharmacy");
                  onOpenPharm();
                }}
              >
                Pharmacy
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setType("vendor");
                  onOpenVendor();
                }}
              >
                Vendor
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setType("lender");
                  onOpenLender();
                }}
              >
                Lender
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </div>
      <Tabs onChange={handleTabsChange} variant={"unstyled"}>
        <TabList className=" overflow-x-scroll">
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
          <Tab
            _selected={{ color: "white", bg: "#1A70B8", borderRadius: "10px" }}
          >
            <div className="flex items-center gap-3">
              <Text>Lenders</Text>
              <p className="bg-orange-50 text-orange-500 py-0.5 px-1.5 rounded-full text-sm">
                {lenderCount?.meta.total || 0}
              </p>
            </div>
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel px={0}>
            <SupplierTab
              isLoading={isLoading}
              data={supplierData}
              type="Suppliers"
              pageCount={pageCount}
              fetchTeamUser={fetchTeamUser}
              setPageCount={setPageCount}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              userType={"SUPPLIERS"}
            />
          </TabPanel>
          <TabPanel>
            <SupplierTab
              isLoading={isLoading}
              data={pharmData}
              type="Pharmacies"
              pageCount={pageCount}
              fetchTeamUser={fetchTeamUser}
              setPageCount={setPageCount}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              userType={"PHARMACIES"}
            />
          </TabPanel>
          <TabPanel>
            <SupplierTab
              isLoading={isLoading}
              data={vendorData}
              type="Vendors"
              pageCount={pageCount}
              fetchTeamUser={fetchTeamUser}
              setPageCount={setPageCount}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              userType={"VENDOR"}
            />
          </TabPanel>
          <TabPanel>
            <LenderTab
              isLoading={isLoading}
              data={lenderData}
              pageCount={pageCount}
              fetchTeamUser={fetchTeamUser}
              setPageCount={setPageCount}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              userType="LENDERS"
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
      <AddNewDrawer
        isOpen={isOpen}
        onClose={onClose}
        type={type}
        fetchTeamUser={fetchTeamUser}
      />
      <AddNewDrawer
        isOpen={isOpenPharm}
        onClose={onClosePharm}
        type={type}
        fetchTeamUser={fetchTeamUser}
      />
      <AddNewDrawer
        isOpen={isOpenVendor}
        onClose={onCloseVendor}
        type={type}
        fetchTeamUser={fetchTeamUser}
      />
      <AddNewDrawer
        isOpen={isOpenLender}
        onClose={onCloseLender}
        type={type}
        fetchTeamUser={fetchTeamUser}
      />
    </div>
  );
};

export default Users;
