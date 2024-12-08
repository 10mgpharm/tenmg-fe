import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import AuthWrapper from "../../_components/AuthWrapper";
import SignupTab from "../../_components/SignupTab";

const SignUpPharmacy = async () => {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect(`/`);
  }

  return (
    <AuthWrapper type="others">
      <section className="h-full md:w-1/2 w-full">
        <SignupTab />
      </section>
    </AuthWrapper>
  );
};

export default SignUpPharmacy;
