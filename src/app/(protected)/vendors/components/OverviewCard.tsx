import { Card, CardBody, CardHeader } from "@chakra-ui/react";
import Image from "next/image";

const OverviewCard = ({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type?: "currency";
}) => {
  return (
    <Card borderRadius="lg" p={6} gap={6}>
      <CardHeader p={0} fontSize="md" fontWeight="medium">
        {title}
      </CardHeader>
      <CardBody p={0} fontSize="4xl" fontWeight="semibold">
        {type === "currency" ? `₦${value}` : value}
      </CardBody>
    </Card>
  );
};

export default OverviewCard;
