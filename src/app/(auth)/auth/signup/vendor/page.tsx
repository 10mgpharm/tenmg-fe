"use client";

import React from "react";
import AuthWrapper from "../../../components/AuthWrapper";
import SignUpField from "../../../components/SignupField";

const SignUpPharmacy = () => {
  return (
    <AuthWrapper type="others">
      <section className="md:w-1/2 w-full flex items-center">
        <SignUpField title="vendor" />
      </section>
    </AuthWrapper>
  );
};

export default SignUpPharmacy;
