import { Dispatch, SetStateAction, useState } from "react";
import OperationLayout from "../OperationLayout";
import SelectWithdrawalDestination from "../SelectWithdrawalDestination";
import WithdrawToBank from "../withdrawToBank";
import TransferToMainWallet from "../transferToMainWallet";

export interface WithdrawFundsProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: any;
  onSuccess?: () => void;
  setAmount: Dispatch<SetStateAction<number>>;
  setIsWithdraw: Dispatch<SetStateAction<boolean>>;
}

const WithdrawFunds = (props: WithdrawFundsProps) => {
  const [withdrawalType, setWithdrawalType] = useState<"EXTERNAL" | "INTERNAL">(
    "EXTERNAL"
  );
  const [formStep, setFormStep] = useState(1);

  const handleClose = () => {
    props.onClose();
  };

  return (
    <OperationLayout
      isOpen={props.isOpen}
      onClose={handleClose}
      title="Withdraw Funds"
      description={
        formStep === 1
          ? "Choose where to move your funds: "
          : "Funds can only be withdrawn from your investment wallet, you cannot withdraw more than your investment wallet balance."
      }
    >
      {/*  */}
      {formStep === 1 && (
        <>
          <SelectWithdrawalDestination
            withdrawalType={withdrawalType}
            setWithdrawalType={setWithdrawalType}
            setFormStep={setFormStep}
          />
        </>
      )}

      {formStep === 2 && withdrawalType === "EXTERNAL" && (
        <>
          <WithdrawToBank {...props} setFormStep={setFormStep} />
        </>
      )}

      {formStep === 2 && withdrawalType === "INTERNAL" && (
        <>{<TransferToMainWallet {...props} setFormStep={setFormStep} />}</>
      )}
    </OperationLayout>
  );
};

export default WithdrawFunds;
