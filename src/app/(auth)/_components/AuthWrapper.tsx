import Image from "next/image";

interface AuthWrapperProps {
  children: React.ReactNode;
  type: "reset-password" | "others";
}
export default function AuthWrapper({
  children,
  type = "others",
}: AuthWrapperProps) {
  return (
    <>
      <div className="min-h-screen md:flex w-full items-stretch ">
        <div
          style={{
            background:
              "linear-gradient(151.09deg, rgba(255, 57, 83, 0.1) 0.44%, rgba(24, 73, 169, 0.05) 67.54%)",
          }}
          className="hidden md:w-1/2 md:flex justify-center items-center sticky top-0 h-screen"
        >
          {type === "reset-password" ? (
            <Image
              src="/assets/images/tenmg_medicine_icon.png"
              className="w-36 h-36 md:w-[400px] md:h-[400px]"
              unoptimized
              alt="tenmg"
              width={400}
              height={400}
            />
          ) : (
            <Image
              src="/assets/images/tenmg_login.gif"
              className="w-36 h-36 md:w-[600px] md:h-[600px]"
              unoptimized
              alt="tenmg"
              width={600}
              height={600}
            />
          )}
        </div>
        {children}
      </div>
    </>
  );
}
