"use client";

import AuthWrapper from "../../_components/AuthWrapper";
import InvitationField from "../../_components/InvitationField";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <AuthWrapper type="others">
      <Suspense fallback={<div>Loading...</div>}>
        <InvitationField />
      </Suspense>
    </AuthWrapper>
  );
}
