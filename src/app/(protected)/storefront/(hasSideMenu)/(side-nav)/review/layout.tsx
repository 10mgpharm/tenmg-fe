import { Divider, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import React from "react";
import { BreadCrumbs } from "../../../_components/BreadCrumbBanner";

export default function ProductReviewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // /storefront/reviews/reviewed
  // /reviews/pending-reviews

  const breadCrumb = [
    {
      text: "Reviews",
      link: "/storefront/reviews/reviewed",
    },
    {
      text: "Product",
      link: "#",
    },
  ];

  return (
    <div className="mt-4 ">
      <div className="mb-2">
        <BreadCrumbs breadCrumbsData={breadCrumb} />
      </div>
      <h2 className="font-semibold text-2xl text-gray-600">Product Review</h2>
      <Divider my={[2, 5]} border="1px solid gray.200" />
      <div className="mt-2 md:mt-4">
        <div className="border border-gray-200 rounded-md p-4 bg-gray-25">
          {children}
        </div>
      </div>
    </div>
  );
}
