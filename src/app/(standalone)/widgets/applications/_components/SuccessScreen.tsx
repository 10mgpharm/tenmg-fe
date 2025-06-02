import {
  Text,
} from "@chakra-ui/react";
import LoanLayout from "../../_components/LoanLayout";
import LoanProfile from "../../_components/LoanProfile";
import { ApplicationDto, BusinessDto, CustomerDto } from "@/types";
import LoanInnerWrapper from "../../_components/LoanInnerWrapper";
import { useEffect } from "react";
import { toast } from "react-toastify";

interface Props {
  token: string;
  business: BusinessDto;
  customer: CustomerDto;
  application: ApplicationDto;
  callbackUrl?: string;
  navigateBackAction?: () => void;
}

const SuccessScreen = ({
  token,
  business,
  application,
  customer,
  callbackUrl,
  navigateBackAction,
}: Props) => {

  console.log(callbackUrl)

  useEffect(() => {
    if (callbackUrl && callbackUrl !== "") {
      toast.info("Redirecting you order confirmation page...", {
        position: "bottom-center",
        autoClose: 3000,
      });

      const timeout = setTimeout(() => {
        const reference = application?.txnReference || application?.identifier;
        window.location.href = `${callbackUrl}?reference=${reference}`;
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [application?.identifier, application?.txnReference, callbackUrl]);
  
  return (
    <LoanLayout
      name={business?.name}
      logo={business?.logo}
      navigateBackAction={navigateBackAction}
    >
      <>
        <section className="flex justify-between items-center w-full pb-8">
          <LoanProfile name={customer?.name} email={customer?.email} />
        </section>

        <LoanInnerWrapper
          headerIcon={<Text fontSize="8xl">🎉</Text>}
          heading="Mandate Authentication Successful!"
          text="Congratulations! Your Credit Application was submitted. Please
              keep an eye on your email, where you’ll soon receive more
              information, including important details about the next steps."
        />
      </>
    </LoanLayout>
  );
};

export default SuccessScreen;
