import AuthWrapper from "../../_components/AuthWrapper";
import InvitationField from "../../_components/InvitationField";

export default async function LoginPage() {
 
  return (
    <AuthWrapper type="others">
     <InvitationField />
    </AuthWrapper>
  );
}
