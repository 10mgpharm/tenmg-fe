import AuthWrapper from "@/app/(auth)/_components/AuthWrapper";
import SignUpField from "@/app/(auth)/_components/SignupField";
import { redirect } from "next/navigation";
import React from "react";

type SelectedValueType = "SUPPLIER" | "PHARMACY" | "VENDOR" | "LENDER";

const UserSignUp = ({
  params: { userType },
}: {
  params: { userType: SelectedValueType };
}) => {
  const validUserTypes = ["LENDER", "VENDOR", "SUPPLIER", "PHARMACY"];
  if (!userType || !validUserTypes.includes(userType.toUpperCase())) {
    return redirect("/auth/signup");
  }

  return (
    <AuthWrapper type="others">
      <div className="w-full md:w-1/2  mt-10 mb-10 px-5 md:px-10 lg:px-16">
        <div className="w-full ">
          <SignUpField title={userType.toUpperCase() as SelectedValueType} />
        </div>
      </div>
    </AuthWrapper>
  );
};

export default UserSignUp;
