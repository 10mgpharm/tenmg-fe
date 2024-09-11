"use client";

import AuthWrapper from "../../components/AuthWrapper";
import SignUpField from "../../components/SignupField";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

const SignUpPharmacy = () => {
  return (
    <AuthWrapper type="others">
      <section className="md:w-1/2 w-full">

        <Tabs variant="unstyled" defaultIndex={0} isFitted>
          <TabList>
            <Tab
              _selected={{ bg: "primary.500", color: "white" }}
              h={{ base: "58px", md: "78px" }}
              color="primary.500"
              fontSize={{ base: "md", md: "lg", lg: "xl" }}
            >
              Supplier
            </Tab>
            <Tab
              _selected={{ bg: "primary.500", color: "white" }}
              h={{ base: "58px", md: "78px" }}
              color="primary.500"
              fontSize={{ base: "md", md: "lg", lg: "xl" }}
            >
              Pharmacy or Hospital
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <SignUpField title="supplier" />
            </TabPanel>
            <TabPanel>
              <SignUpField title="pharmacy" />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </section>
    </AuthWrapper>
  );
};

export default SignUpPharmacy;
