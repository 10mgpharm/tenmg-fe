import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import AuthWrapper from "../../components/AuthWrapper";
import SignupTab from "../../components/SignupTab";

const SignUpPharmacy = async () => {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect(`/`);
  }

  return (
    <AuthWrapper type="others">
      <section className="md:w-1/2 w-full min-h-screen">
        <SignupTab />
      </section>
    </AuthWrapper>
  );
};

export default SignUpPharmacy;
