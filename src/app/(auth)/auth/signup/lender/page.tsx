import React from "react";
import AuthWrapper from "@/app/(auth)/_components/AuthWrapper";
import SignUpField from "@/app/(auth)/_components/SignupField";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const SignUpPharmacy = async () => {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect(`/`);
  }
  return (
    <AuthWrapper type="others">
      <section className="h-auto md:w-1/2 w-full flex items-center">
        <SignUpField title="lender" />
      </section>
    </AuthWrapper>
  );
};

export default SignUpPharmacy;
