import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import AuthWrapper from "../../_components/AuthWrapper";
import SignUp_Select_form from "./_components/signUp-select-form";

const SignUpPharmacy = async () => {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect(`/`);
  }

  return (
    <AuthWrapper type="others">
      <div className="w-full md:w-1/2  mt-10 mb-10 px-5 md:px-10 lg:px-16">
        <div className="w-full ">
          <SignUp_Select_form />
        </div>
      </div>
    </AuthWrapper>
  );
};

export default SignUpPharmacy;
