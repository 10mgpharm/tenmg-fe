"use client";

import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { handleServerErrorMessage } from "@/utils";
import requestClient from "@/lib/requestClient";
import { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDisclosure } from "@chakra-ui/react";
import { IFormInput } from "../../add-product/page";
import { NextAuthUserSession, ProductDataProps } from "@/types";
import DetailForm from "@/app/(protected)/suppliers/products/_components/DetailForm";
import EssentialForm from "@/app/(protected)/suppliers/products/_components/EssentialForm";
import InventoryForm from "@/app/(protected)/suppliers/products/_components/InventoryForm";
import SuccessModal from "@/app/(protected)/suppliers/products/_components/SuccessModal";
import { useRouter } from "next/navigation";

const EditPage = ({ params }: { params: { id: string } }) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [steps, setSteps] = useState<"details" | "essentials" | "inventory">(
    null
  );

  useEffect(() => {
    setSteps("details");
  }, []);

  const router = useRouter();
  const session = useSession();
  const sessionToken = session?.data as NextAuthUserSession;
  const token = sessionToken?.user?.token;

  const [products, setProducts] = useState<ProductDataProps>();

  const fetchSingleProduct = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await requestClient({ token: token }).get(
        `/admin/settings/products/${params.id}`
      );
      if (response.status === 200) {
        setProducts(response.data.data);
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }, [params.id, token]);

  useEffect(() => {
    if (!token) return;
    fetchSingleProduct();
  }, [fetchSingleProduct, token]);

  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    trigger,
    reset,
    watch,
    getValues,
  } = useForm<IFormInput>({
    mode: "onChange",
    defaultValues: {
      productName: products?.name,
      productDescription: products?.description,
      brandName: products?.brand.name,
      categoryName: products?.category.name,
      status: products?.status,
    },
  });

  useEffect(() => {
    const expiredAt = products?.expiredAt
      ? new Date(products?.expiredAt)
      : null;
    setValue("productName", products?.name);
    setValue("brandName", products?.brand?.name);
    setValue("categoryName", products?.category?.name);
    setValue("productDescription", products?.description);
    setValue("thumbnailFile", products?.thumbnailFile);
    setValue("medicationTypeName", products?.medicationType?.name);
    setValue("presentationName", products?.presentation?.name);
    setValue("measurementName", products?.measurement?.name);
    setValue("packageName", products?.package?.name);
    setValue("strengthValue", products?.variation?.strengthValue);
    setValue("packageName", products?.variation?.packagePerRoll);
    setValue("weight", products?.variation?.weight?.toString());
    setValue("actualPrice", products?.actualPrice);
    setValue("discountPrice", products?.discountPrice);
    setValue("quantity", products?.quantity);
    setValue("lowStockLevel", products?.lowStockLevel?.toString());
    setValue("outStockLevel", products?.outStockLevel?.toString());
    setValue("expiredAt", products?.expiredAt);
    setValue("status", products?.status);
  }, [products, setValue]);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsLoading(true);
    const dateString = data?.expiredAt?.toString();
    let formattedDate: string;
    if (dateString.includes("Z")) {
      formattedDate = data?.expiredAt;
    } else {
      formattedDate = new Date(data?.expiredAt).toLocaleDateString("en-CA");
    }
    const formdata = new FormData();
    formdata.append("productName", data.productName);
    formdata.append("productDescription", data.productDescription);
    formdata.append("medicationTypeName", data.medicationTypeName);
    formdata.append("categoryName", data?.categoryName);
    formdata.append("brandName", data?.brandName);
    formdata.append("weight", data?.weight);
    formdata.append("packageName", data?.brandName);
    formdata.append("presentationName", data?.presentationName);
    formdata.append("strengthValue", data?.strengthValue);
    formdata.append("measurementName", data?.measurementName);
    formdata.append("lowStockLevel", data?.lowStockLevel);
    formdata.append("outStockLevel", data?.outStockLevel);
    formdata.append("expiredAt", formattedDate);
    formdata.append("thumbnailFile", data?.thumbnailFile);
    formdata.append("actualPrice", data?.actualPrice);
    formdata.append("discountPrice", data?.discountPrice);
    formdata.append("quantity", data?.quantity);
    formdata.append("status", data?.status);

    try {
      const response = await requestClient({ token: token }).post(
        `/admin/settings/products/${products?.id}`,
        formdata
      );
      if (response.status === 200) {
        setIsLoading(false);
        toast.success(response.data?.message);
        router.push("/admin/products");
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
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {(() => {
          switch (steps) {
            case "details":
              return (
                <DetailForm
                  title="Edit Product"
                  isEditing={true}
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
                />
              );
            case "essentials":
              return (
                <EssentialForm
                  isEditing={true}
                  type="admin"
                  handleStepValidation={async () => {
                    const isValid = await handleStepValidation([
                      "medicationTypeName",
                      "measurementName",
                      "presentationName",
                      "strengthValue",
                      "packageName",
                      "weight",
                      "actualPrice",
                      "discountPrice",
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
                  isEditing={true}
                  data={products}
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
              break;
          }
        })()}
      </form>
      <SuccessModal
        isOpen={isOpen}
        onClose={onClose}
        routeUrl="/admin/products"
        isEditing={true}
        routeUrl2="/admin/product/new"
        reset={reset}
        setSteps={setSteps}
      />
    </div>
  );
};

export default EditPage;
