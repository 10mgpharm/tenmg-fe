"use client";
import React, { useEffect, useState } from "react";
import { Button, HStack, Tag } from "@chakra-ui/react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

import requestClient from "@/lib/requestClient";
import { handleServerErrorMessage } from "@/utils";
import { NextAuthUserSession } from "@/types";

import DeleteAddressModal from "../../../../_components/DeleteAddressModal";
import EditAddressModal from "../../../../_components/EditAddressModal";

export default function ShippingAddressList() {
  const [shippingAddresses, setShippingAddresses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const session = useSession();
  const sessionData = session.data as NextAuthUserSession;
  const userToken = sessionData?.user?.token;

  // Fetch addresses on mount
  useEffect(() => {
    if (!userToken) return;

    const fetchAddresses = async () => {
      setIsLoading(true);
      try {
        const response = await requestClient({ token: userToken }).get(
          "/storefront/shipping-addresses"
        );
        if (response.status === 200) {
          const data = response.data.data;
          setShippingAddresses(data || []);
        } else {
          toast.error(`Error: ${response.data.message}`);
        }
      } catch (error) {
        const errorMessage = handleServerErrorMessage(error);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddresses();
  }, [userToken]);

  const refreshAddresses = async () => {
    if (!userToken) return;
    setIsLoading(true);

    try {
      const response = await requestClient({ token: userToken }).get(
        "/storefront/shipping-addresses"
      );
      if (response.status === 200) {
        setShippingAddresses(response.data.data || []);
      } else {
        toast.error(`Error: ${response.data.message}`);
      }
    } catch (error) {
      const errorMessage = handleServerErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const setDefaultAddress = async (addressId: string) => {
    setIsLoading(true);

    try {
      const response = await requestClient({ token: userToken }).post(
        "/storefront/shipping-addresses/set-default",
        { addressId }
      );
      if (response.status === 200) {
        refreshAddresses();
      } else {
        toast.error(`Error: ${response.data.message}`);
      }
    } catch (error) {
      const errorMessage = handleServerErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading addresses...</div>;
  }

  if (!shippingAddresses?.length) {
    return (
      <section className="w-11/12 mx-auto py-8">
        <div className="text-center py-4">No shipping addresses found.</div>
        {/* Button to Add a new address */}
        <div className="mt-10 mb-6 w-1/4 mx-auto">
          <EditAddressModal onSuccess={refreshAddresses} />
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-11/12 mx-auto py-8">
        {shippingAddresses.map((address) => (
          <div
            key={address.id}
            className="border border-gray-300 p-5 flex flex-col gap-2 rounded-md mx-auto w-full relative"
          >
            <div className="absolute top-4 right-4 w-fit ">
              {address?.isDefault ? (
                <Tag
                  size={"sm"}
                  variant="solid"
                  colorScheme="green"
                  p={2}
                  className="w-fit"
                >
                  Default
                </Tag>
              ) : (
                <Button
                  size={"xs"}
                  variant={"solid"}
                  colorScheme={"success"}
                  className="w-fit "
                  onClick={() => setDefaultAddress(address?.id)}
                >
                  Set as Preferred
                </Button>
              )}
            </div>
            <h2 className="text-xl font-bold">{address.name}</h2>
            <p className="text-base font-bold">{address.phoneNumber}</p>
            <p className="text-sm text-gray-500">
              {address.address}, {address.city}, {address.state},{" "}
              {address.country}
            </p>

            <HStack pt={4}>
              <EditAddressModal
                id={address.id}
                existingData={address}
                onSuccess={refreshAddresses}
              />
              <DeleteAddressModal
                id={address.id}
                onSuccess={refreshAddresses}
              />
            </HStack>
          </div>
        ))}
      </div>

      <div className="mt-10 mb-6 w-1/4 mx-auto">
        {/* Button to Add a new address */}
        <EditAddressModal onSuccess={refreshAddresses} />
      </div>
    </section>
  );
}
