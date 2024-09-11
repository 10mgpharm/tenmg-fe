"use client";

import React from "react";
import AuthWrapper from "../../components/auth-wrapper";
import SignUpField from "../../components/signup-field";

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
