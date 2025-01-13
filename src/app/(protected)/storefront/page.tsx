import { NextAuthUserSession } from "@/types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import StoreFrontPharmacy from "./_components/StorefrontPharmacy";

const StoreFront = () => {
  const session = useSession();
  const userData = session.data as NextAuthUserSession;

  const productTitle = [
    "FREQUENTLY BOUGHT ITEMS",
    "CHRONIC CONDITIONS",
    "VACCINE & SPECIAL MEDICATIONS",
    "REPRODUCTIVE HEALTH & FERTILITY SOLUTIONS",
    "ASTHMA & ALLERGIES",
    "HOSPITALS AND CLINICS",
  ];

  // console.log(userData?.user?.token);
  //  const response = await requestClient().post("/storefront"

  //   const response = await requestClient({token: sessionData.user.token}).patch(
  //     "account/settings/profile",
  //     {
  //         ...value
  //     }
  // )
  const [storeFrontData, setStoreFrontData] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);
  useEffect(() => {
    const fetchStoreFront = async () => {
      try {
        const data = await requestClient({ token: userData?.user?.token }).get("/storefront");
        // console.log(data);
        setStoreFrontData(data?.data?.data?.data);

        const storeCount = data?.data?.data?.data?.flatMap(item => item.products).length;
        setIsEmpty(storeCount === 0);
      } catch (e) {
        console.log(e)
      }
    }
    fetchStoreFront();
  }, [userData?.user?.token])

  console.log("storeFrontData", storeFrontData);

  return (
    <div>
      <StoreFrontPharmacy businessStatus={data?.user?.businessStatus} />
    </div>
  );
};

export default StoreFront;
