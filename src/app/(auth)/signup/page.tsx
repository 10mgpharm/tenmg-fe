"use client";

import { useState } from "react";
import { Tabs, Tab } from "@nextui-org/tabs";
import AuthWrapper from "../components/auth-wrapper";
import SignUpField from "../components/signup-field";

const SignUpPharmacy = () => {
  return (
    <AuthWrapper type="others">
      <section className="md:w-1/2 w-full">
        <Tabs
          aria-label="pharmacy"
          variant="light"
          fullWidth
          defaultSelectedKey="pharmacy"
          radius="none"
          disableAnimation
          classNames={{
            tabList: "gap-0 relative p-0 shadow-none",
            tab: "bg-primary shadow-none h-[58px] md:h-[78px] data-[selected=true]:bg-background",
            tabContent:
              "group-data-[selected=true]:text-primary text-background text-md md:text-lg lg:text-xl",
          }}
        >
          <Tab key="supplier" title="Supplier">
            <SignUpField title="supplier" />
          </Tab>
          <Tab key="pharmacy" title="Pharmacy or Hospital">
            <SignUpField title="pharmacy" />
          </Tab>
        </Tabs>
      </section>
    </AuthWrapper>
  );
};

export default SignUpPharmacy;
