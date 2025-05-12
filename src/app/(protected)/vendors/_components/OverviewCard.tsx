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
  color = "",
}: {
  title: string;
  value: number | string;
  type?: "currency";
  percentageFooter?: number | string;
  increasePercentage?: Boolean;
  isPending?: Boolean;
  pendingValue?: number;
  color?: string;
}) => {
  return (
    <Card borderRadius="lg" p={6} gap={6}>
      <CardHeader p={0} fontSize="md" fontWeight="medium">
        {title}
      </CardHeader>
      <CardBody
        p={0}
        fontSize={{ base: "x-large", md: "xl", lg: "2xl" }}
        fontWeight="semibold"
      >
        <Flex gap={2} alignItems="center" flexWrap="wrap" minWidth={0}>
          <Box as="span" minWidth={0} textOverflow="ellipsis" overflow="hidden" color={color}>
            {type === "currency" ? `₦${value}` : value}
          </Box>
          {isPending && (
            <Tag
              size="sm"
              variant="subtle"
              colorScheme="warning"
              fontWeight="bold"
              maxWidth={{ base: "100%", sm: "150px" }}
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
            >
              <TagLabel fontSize="xs" isTruncated>
                {pendingValue} Ongoing Loan
              </TagLabel>
            </Tag>
          )}
        </Flex>
      </CardBody>
      {percentageFooter && (
        <CardFooter p={0}>
          <Flex alignItems="center" gap={1} fontSize="xs">
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
          <Text>vs last 7 days</Text>
          </Flex>
        </CardFooter>
      )}
    </Card>
  );
};

export default OverviewCard;
