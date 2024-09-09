"use client";

import { useState } from "react";
import { Button, Link } from "@nextui-org/react";
import Image from "next/image";
import React from "react";
import { useForm } from "react-hook-form";
import { FiEyeOff } from "react-icons/fi";
import { IoEyeOutline } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { Tabs, Tab } from "@nextui-org/tabs";
import { usePathname } from "next/navigation";
import AuthWrapper from "../components/auth-wrapper";
import SignUpField from "../components/signup-field";

const SignUpPharmacy = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState<boolean>(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  return (
    <AuthWrapper>
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
