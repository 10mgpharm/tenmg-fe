"use client";
import EmptyOrder from "@/app/(protected)/suppliers/orders/_components/EmptyOrder";
import {
  ColumnOrderState,
  RowSelectionState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Divider,
  Flex,
  Progress,
  Stack,
  Text,
  ThemeProvider,
  extendTheme,
  chakra,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import requestClient from "@/lib/requestClient";
import Loader from "@/app/(protected)/admin/_components/Loader";
import { convertDate } from "@/utils/formatDate";
import { formatAmount } from "@/utils/formatAmount";
import { formatAmountString } from "@/utils";

const defaultTheme = extendTheme({
  components: {
    Progress: {
      baseStyle: {
        track: {
          borderRadius: "10px",
        },
        filledTrack: {
          bg: "#F89422",
          track: {
            borderRadius: "0px",
            borderTopRightRadius: "0px",
            borderBottomRightRadius: "0px",
          },
        },
      },
    },
  },
});

interface LoanDetailViewProps {
  id: string;
  endpoint: string;
  title?: string;
  subtitle?: string;
  columnsFn: any;
  emptyStateHeading?: string;
  emptyStateContent?: string;
  theme?: any;
  onBack?: () => void;
}

const LoanDetailView = ({
  id,
  endpoint,
  title = "Loan Information",
  subtitle = "At a glance summary of the loan",
  columnsFn,
  emptyStateHeading = "No repayment history Yet",
  emptyStateContent = "You currently have no repayment history. All repayment history will appear here.",
  theme = defaultTheme,
  onBack,
}: LoanDetailViewProps) => {
  const router = useRouter();
  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [data, setData] = useState<any>(null);

  const hasValidSchedule = data?.repaymentSchedule?.length > 0;
  const totalRepaymentValue = data?.repaymentSchedule?.length;

  const calculateProgress = () => {
    if (!hasValidSchedule) {
      return 0;
    }

    const paidItems = data.repaymentSchedule.filter(
      (item: any) => item.paymentStatus === "PAID"
    ).length;

    return Math.round((paidItems / totalRepaymentValue) * 100);
  };

  const calculateRepayment = () => {
    if (!hasValidSchedule) {
      return 0;
    }

    return data.repaymentSchedule.reduce((total: number, item: any) => {
      const balance = parseFloat(item.balance || 0);
      return total + (isNaN(balance) ? 0 : balance);
    }, 0);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await requestClient({ token }).get(
          `${endpoint}/${id}`
        );

        if (response.status === 200 && response.data.data) {
          setData(response.data.data);
        } else {
          setError("Failed to load data. Please try again.");
        }
      } catch (err: any) {
        console.error(err);
        setError("An unexpected error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    if (token && id) {
      fetchData();
    }
  }, [token, id, endpoint]);

  const table = useReactTable({
    data: data?.repaymentSchedule || [],
    columns: columnsFn(),
    onSortingChange: setSorting,
    state: {
      sorting,
      columnVisibility,
      columnOrder,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const getLoanDates = () => {
    if (
      !data?.repaymentSchedule ||
      !Array.isArray(data.repaymentSchedule) ||
      data.repaymentSchedule.length === 0
    ) {
      return { startDate: "N/A", endDate: "N/A" };
    }

    // Sort the repayments by due date
    const sortedSchedule = [...data.repaymentSchedule].sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );

    const startDate = sortedSchedule[0].createdAt || sortedSchedule[0].dueDate;
    const endDate = sortedSchedule[sortedSchedule.length - 1].dueDate;

    return { startDate, endDate };
  };

  const { startDate, endDate } = getLoanDates();
  const progressValue = calculateProgress();
  const repaymentAmount = calculateRepayment();

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <Flex cursor={"pointer"} gap={2} onClick={handleBack}>
        <ArrowLeft className="w-4 md:w-5 h-auto text-gray-600" />
        <Text fontSize={{base: "sm", md: "md"}}>Back</Text>
      </Flex>
      {loading && <Loader />}

      {!loading && (
        <>
          <Stack mt={3} gap={0.5}>
            <Text fontSize={{base: "lg", md: "xl", lg: "1.2rem"}} fontWeight={600}>
              {data?.customer?.name
                ? `${data.customer.name}'s ${title}`
                : title}
            </Text>
            <Text fontSize={{base: "xs", md: "sm", lg: "15px"}} color={"gray.600"}>
              {data?.customer?.name
                ? subtitle.replace("the loan", `${data.customer.name}'s Loan`)
                : subtitle}
            </Text>
          </Stack>
          <Stack mt={3} className="p-3 md:p-4 lg:p-5 rounded-md border bg-white">
            <Flex 
              direction={{base: "column", md: "row"}} 
              flexWrap="wrap" 
              gap={{base: 4, md: 2, lg: 0}}
              justify={"space-between"} 
              mb={{base: 2, md: 3}}
            >
              <Stack minW={{base: "full", sm: "45%", md: "auto"}}>
                <Text fontSize={{base: "xs", md: "sm", lg: "15px"}} color={"gray.500"}>
                  Loan Amount
                </Text>
                <Text fontWeight={500} fontSize={{base: "md", md: "lg", lg: "1.2rem"}}>
                  ₦
                  {data?.capitalAmount
                    ? formatAmountString(data?.capitalAmount)
                    : "0.00"}
                </Text>
              </Stack>
              <Stack minW={{base: "full", sm: "45%", md: "auto"}}>
                <Text fontSize={{base: "xs", md: "sm", lg: "15px"}} color={"gray.500"}>
                  Loan Interest
                </Text>
                <Text fontWeight={500} fontSize={{base: "md", md: "lg", lg: "1.2rem"}}>
                  ₦
                  {data?.interestAmount
                    ? formatAmountString(data?.interestAmount)
                    : "0.00"}
                    <Text fontWeight={400} color="success.600" fontSize={{base: "xs", md: "0.8rem"}}>
                  Interest Rate: {data?.application?.interestRate}%
                </Text>
                </Text>
              </Stack>
              <Stack minW={{base: "full", sm: "45%", md: "auto"}}>
                <Text fontSize={{base: "xs", md: "sm", lg: "15px"}} color={"gray.500"}>
                  Total Repayment
                </Text>
                <Text fontWeight={500} fontSize={{base: "md", md: "lg", lg: "1.2rem"}}>
                  ₦{formatAmountString(data?.totalAmount) || "0.00"}
                </Text>
              </Stack>
              <Stack minW={{base: "full", sm: "45%", md: "auto"}}>
                <Text fontSize={{base: "xs", md: "sm", lg: "15px"}} color={"gray.500"}>
                  Duration
                </Text>
                <Text fontWeight={500} fontSize={{base: "md", md: "lg", lg: "1.2rem"}}>
                  {data?.application?.durationInMonths || "N/A"} months
                </Text>
              </Stack>
              <Stack minW={{base: "full", sm: "45%", md: "auto"}}>
                <Text fontSize={{base: "xs", md: "sm", lg: "15px"}} color={"gray.500"}>
                  Start Date
                </Text>
                <Text fontWeight={500} fontSize={{base: "md", md: "lg", lg: "1.2rem"}}>
                  {startDate && startDate !== "N/A"
                    ? convertDate(startDate)
                    : "N/A"}
                </Text>
              </Stack>
              <Stack minW={{base: "full", sm: "45%", md: "auto"}}>
                <Text fontSize={{base: "xs", md: "sm", lg: "15px"}} color={"gray.500"}>
                  End Date
                </Text>
                <Text fontWeight={500} fontSize={{base: "md", md: "lg", lg: "1.2rem"}}>
                  {endDate && endDate !== "N/A" ? convertDate(endDate) : "N/A"}
                </Text>
              </Stack>
            </Flex>
            <Divider />
            <Stack mt={3} maxW={{base: "100%", md: "80%", lg: "60%"}}>
              <Text fontWeight={600} fontSize={{base: "sm", md: "md", lg: "1rem"}} mb={{base: 1, md: 2}}>
                Status
              </Text>
              <ThemeProvider theme={theme}>
                <Progress h={{base: "24px", md: "30px", lg: "34px"}} value={progressValue} pos={"relative"}>
                  <chakra.span className="text-black text-center text-xs md:text-sm absolute top-1 md:top-2 inset-x-0">
                    {progressValue === 100
                      ? "Loan Fully Repaid"
                      : progressValue === 0
                      ? "Repayment Not Started"
                      : `Repayment in Progress - ${progressValue}% Complete`}
                  </chakra.span>
                </Progress>
              </ThemeProvider>
            </Stack>
          </Stack>
          <Stack mt={{base: 4, md: 5, lg: 6}}>
            <Text fontWeight={600} fontSize={{base: "lg", md: "xl", lg: "1.2rem"}} mb={{base: 1, md: 2}}>
              Repayment History
            </Text>
            <div className="w-full">
              {!data?.repaymentSchedule ||
              data.repaymentSchedule.length === 0 ? (
                <EmptyOrder
                  heading={emptyStateHeading}
                  content={emptyStateContent}
                />
              ) : (
                <div className="overflow-x-auto">
                  <TableContainer
                    border={"1px solid #F9FAFB"}
                    borderRadius={"10px"}
                    className="min-w-full"
                  >
                    <Table className="min-w-[800px]">
                      <Thead bg={"#F2F4F7"}>
                        {table?.getHeaderGroups()?.map((headerGroup) => (
                          <Tr key={headerGroup.id}>
                            {headerGroup.headers?.map((header) => (
                              <Th
                                textTransform={"initial"}
                                px="0px"
                                key={header.id}
                                className="whitespace-nowrap text-xs md:text-sm"
                              >
                                {header.isPlaceholder
                                  ? null
                                  : flexRender(
                                      header.column.columnDef.header,
                                      header.getContext()
                                    )}
                              </Th>
                            ))}
                          </Tr>
                        ))}
                      </Thead>
                      <Tbody bg={"white"} color="#606060" fontSize={{base: "12px", md: "14px"}}>
                        {table?.getRowModel()?.rows?.map((row) => (
                          <Tr key={row.id}>
                            {row.getVisibleCells()?.map((cell) => (
                              <Td key={cell.id} px="0px" className="whitespace-nowrap">
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </Td>
                            ))}
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </div>
              )}
            </div>
          </Stack>
        </>
      )}
    </div>
  );
};

export default LoanDetailView;
