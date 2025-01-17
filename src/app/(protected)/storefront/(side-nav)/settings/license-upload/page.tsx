import { Suspense } from "react";
import LicenseUpload from "@/app/(protected)/_components/LicenseUpload";
import Loader from "@/app/(protected)/admin/_components/Loader";

const DocumentUpload = () => {
  return (
    <Suspense fallback={ <Loader />}>
      <LicenseUpload endpoint="storefront" />
    </Suspense>
  );
};

export default DocumentUpload;

