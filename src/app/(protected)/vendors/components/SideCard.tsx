import { Card, CardBody, CardFooter, CardHeader } from "@chakra-ui/react";
import Image from "next/image";

const SideCard = ({
  title,
  value,
  footer,
  color,
}: {
  title: string;
  value: string;
  footer?: React.ReactNode;
  color: string;
}) => {
  return (
    <Card borderRadius="lg" p={6} gap={6} alignItems="center" bg={color}>
      <CardHeader p={0} fontSize="sm" fontWeight="medium">
        {title}
      </CardHeader>
      <CardBody p={0} fontSize="4xl" fontWeight="semibold">
        {value}
      </CardBody>
      <CardFooter p={0}>{footer}</CardFooter>
    </Card>
  );
};

export default SideCard;
