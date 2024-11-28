import {
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Icon,
  Tag,
  TagLabel,
  Text,
} from "@chakra-ui/react";
import classNames from "classnames";
import { ArrowDown, ArrowUp } from "lucide-react";

const OverviewCard = ({
  title,
  value,
  type,
  percentageFooter,
  increasePercentage,
  isPending,
  pendingValue,
}: {
  title: string;
  value: number | string;
  type?: "currency";
  percentageFooter?: number | string;
  increasePercentage?: Boolean;
  isPending?: Boolean;
  pendingValue?: number;
}) => {
  return (
    <Card borderRadius="lg" p={6} gap={6}>
      <CardHeader p={0} fontSize="md" fontWeight="medium">
        {title}
      </CardHeader>
      <CardBody
        p={0}
        fontSize={{ base: "x-large", md: "2xl", lg: "4xl" }}
        fontWeight="semibold"
      >
        <Flex gap={2} alignItems="center">
          {type === "currency" ? `₦${value}` : value}
          {isPending && (
            <Tag
              size="sm"
              variant="subtle"
              colorScheme="warning"
              fontWeight="bold"
            >
              <TagLabel>{pendingValue} Pending</TagLabel>
            </Tag>
          )}
        </Flex>
      </CardBody>
      <CardFooter p={0}>
        <Flex alignItems="center" gap={1}>
          {increasePercentage ? (
            <Icon as={ArrowUp} color="success.500" />
          ) : (
            <Icon as={ArrowDown} color="error.500" />
          )}
          <Text
            color={classNames(increasePercentage ? "success.500" : "error.500")}
          >
            {percentageFooter}%
          </Text>
          <Text fontSize="sm">vs last 7 days</Text>
        </Flex>
      </CardFooter>
    </Card>
  );
};

export default OverviewCard;
