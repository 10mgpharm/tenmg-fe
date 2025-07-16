"use client";

import {
  Button,
  Heading,
  Image,
  Spinner,
  Stack,
  Text,
  useRadioGroup,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { CustomRadio } from "./custom-radio-select";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { ArrowBackIcon } from "@chakra-ui/icons";
const options = [
  {
    value: "LENDER",
    header: "Lender",
    sub: "You offer financial support tailored for pharmacies and healthcare services.",
  },
  {
    value: "VENDOR",
    header: "Vendor",
    sub: "You supply medical and pharmaceutical equipment to healthcare businesses.",
  },

  {
    value: "SUPPLIER",
    header: "Supplier",
    sub: "You distribute pharmaceutical products to pharmacies and healthcare providers.",
  },
  {
    value: "PHARMACY",
    header: "Pharmacy",
    sub: "You operate a licensed pharmacy providing medications and care.",
  },
];
type SelectedValueType = "SUPPLIER" | "PHARMACY" | "VENDOR" | "LENDER" | null;

const SignUp_Select_form = () => {
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);
  const [activeValue, setActiveValue] = useState<SelectedValueType>(null);

  const submit = async (value: SelectedValueType) => {
    setRedirecting(true);
    if (!value) return toast.error("Pls select a user type");
    router.push(`/auth/signup/${value}`);

    setTimeout(() => {
      setRedirecting(false);
    }, 3000);
  };

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "userType",
    defaultValue: "",
    onChange: (value: SelectedValueType) => setActiveValue(value),
  });

  const group = getRootProps();

  return (
    <div className="w-full">
      <div className="w-full">
        <div>
          <div className="flex items-center justify-between mb-2">
            <Link href="/home">
              <Image src={"/icons/logo.svg"} alt="tenmg" boxSize="50px" />
            </Link>

            <div
              onClick={() => router.back()}
              className="size-[45px] bg-primary-50 rounded-full flex items-center justify-center group hover:w-[60px] transition-all"
            >
              <ArrowBackIcon
                fontSize={"20px"}
                className="group-hover:text-primary  transition-all cursor-pointer"
              />
            </div>
          </div>

          <Heading
            as="h3"
            size="lg"
            fontWeight="medium"
            color="gray.900"
            className="mt-3"
          >
            Welcome!
          </Heading>
          <p className="text-gray-500 text-[17px] mt-2">
            Tell us who you are so we can guide you through the right sign-up
            process.
          </p>
        </div>

        <Stack {...group} spacing={4} className="mt-5">
          {options.map((option) => {
            const radio = getRadioProps({ value: option.value });
            return (
              <CustomRadio
                key={option.value}
                {...radio}
                header={option.header}
                sub={option.sub}
                isDisabled={redirecting}
              />
            );
          })}
        </Stack>

        <Button
          className="w-full mt-4"
          disabled={!activeValue || redirecting}
          onClick={() => submit(activeValue)}
        >
          Procced
        </Button>
      </div>
    </div>
  );
};

export default SignUp_Select_form;
