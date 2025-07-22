"use client";

import { useCallback, useEffect, useState } from "react";
import DetailForm from "@/app/(protected)/suppliers/products/_components/DetailForm";
import EssentialForm from "@/app/(protected)/suppliers/products/_components/EssentialForm";
import InventoryForm from "@/app/(protected)/suppliers/products/_components/InventoryForm";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import requestClient from "@/lib/requestClient";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { handleServerErrorMessage } from "@/utils";
import SuccessModal from "../_components/SuccessModal";
import { useDisclosure } from "@chakra-ui/react";

export interface IFormInput {
  productName: string;
  productDescription: string;
  medicationTypeName: string;
  categoryName: string;
  brandName: string;
  measurementName: string;
  presentationName: string;
  packageName: string;
  strengthValue: string;
  actualPrice: string;
  discountPrice: string;
  lowStockLevel: string;
  outStockLevel: string;
  weight: string | null;
  quantity: string;
  expiredAt: any;
  thumbnailFile: string;
  status: string;
}

export interface StepsProps {
  steps: "details" | "essentials" | "inventory";
}
const AddProducts = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [steps, setSteps] = useState<"details" | "essentials" | "inventory">(
    null
  );
  const session = useSession();
  const sessionToken = session?.data as NextAuthUserSession;
  const token = sessionToken?.user?.token;

  useEffect(() => {
    setSteps("details");
  }, []);

  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
    trigger,
    getValues,
    watch,
  } = useForm<IFormInput>({
    mode: "onChange",
    defaultValues: {
      discountPrice: "0",
      status: "INACTIVE",
      thumbnailFile: "",
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsLoading(true);
    const expiryDate = new Date(data?.expiredAt).toLocaleDateString("en-CA");
    const formdata = new FormData();
    formdata.append("productName", data.productName);
    formdata.append("productDescription", data.productDescription);
    formdata.append("medicationTypeName", data.medicationTypeName);
    formdata.append("categoryName", data?.categoryName);
    formdata.append("brandName", data?.brandName);
    formdata.append("weight", data.weight);
    formdata.append("packagePerRoll", data?.packageName);
    formdata.append("presentationName", data?.presentationName);
    formdata.append("strengthValue", data.strengthValue);
    formdata.append("measurementName", data?.measurementName);
    formdata.append("lowStockLevel", data?.lowStockLevel);
    formdata.append("outStockLevel", data?.outStockLevel);
    formdata.append("expiredAt", expiryDate);
    formdata.append("thumbnailFile", data?.thumbnailFile);
    formdata.append("actualPrice", data?.actualPrice);
    formdata.append("discountPrice", data?.discountPrice);
    formdata.append("quantity", data?.quantity);
    formdata.append("status", data.status);

    try {
      const response = await requestClient({ token: token }).post(
        "/supplier/products",
        formdata
      );
      if (response.status === 200) {
        setIsLoading(false);
        onOpen();
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      toast.error(handleServerErrorMessage(error));
    }
  };

  if (steps === null) {
    // Render a loading state or placeholder until the state is initialized
    return <div>Loading...</div>;
  }

  const handleStepValidation = async (fieldsToValidate: any) => {
    const isValid = await trigger(fieldsToValidate);
    return isValid;
  };

  return (
    <div className="p-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        {(() => {
          switch (steps) {
            case "details":
              return (
                <DetailForm
                  title="Add Product"
                  isEditing={false}
                  handleStepValidation={async () => {
                    const isValid = await handleStepValidation([
                      "productName",
                      "productDescription",
                      "categoryName",
                      "brandName",
                      "thumbnailFile",
                    ]);
                    if (isValid) setSteps("essentials");
                  }}
                  control={control}
                  register={register}
                  errors={errors}
                  setValue={setValue}
                  getValue={getValues}
                  type="supplier"
                />
              );
            case "essentials":
              return (
                <EssentialForm
                  isEditing={false}
                  type="supplier"
                  handleStepValidation={async () => {
                    const isValid = await handleStepValidation([
                      "medicationTypeName",
                      "measurementName",
                      "presentationName",
                      "strengthValue",
                      "weight",
                      "actualPrice",
                    ]);
                    if (isValid) setSteps("inventory");
                  }}
                  setSteps={setSteps}
                  register={register}
                  setValue={setValue}
                  control={control}
                  errors={errors}
                  watch={watch}
                />
              );
            case "inventory":
              return (
                <InventoryForm
                  isEditing={false}
                  setSteps={setSteps}
                  register={register}
                  control={control}
                  errors={errors}
                  isLoading={isLoading}
                  setValue={setValue}
                  watch={watch}
                />
              );
            default:
              return null;
          }
        })()}
      </form>
      <SuccessModal
        isOpen={isOpen}
        onClose={onClose}
        routeUrl="/suppliers/products"
        isEditing={false}
        reset={reset}
        setSteps={setSteps}
        routeUrl2="/suppliers/products/add-product"
      />
    </div>
  );
};

export default AddProducts;
