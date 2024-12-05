import AuthWrapper from "../../components/AuthWrapper";
import InvitationField from "../../components/InvitationField";

export default async function LoginPage() {
 
  return (
    <AuthWrapper type="others">
     <InvitationField />
    </AuthWrapper>
  );
}
