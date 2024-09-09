import { useState } from "react";
import { Button, Link } from "@nextui-org/react";
import Image from "next/image";
import { FiEyeOff } from "react-icons/fi";
import { IoEyeOutline } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { useForm, SubmitHandler } from "react-hook-form";

interface SignUpFieldProps {
  title: "supplier" | "pharmacy" | "vendor";
}

interface IFormInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignUpField({ title }: SignUpFieldProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState<boolean>(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = (data) => console.log(data);

  return (
    <>
      <section className="px-6 md:px-12 lg:px-20 xl:px-32">
        <Image
          src="/assets/images/tenmg_logo.png"
          className="md:mb-8"
          alt="tenmg"
          width={75}
          height={75}
        />

        <div className="mb-8">
          <h3 className="font-normal text-gray-900 text-4xl leading-[44px] tracking-tight mb-3">
            Sign Up as a
            {title === "supplier"
              ? " Supplier"
              : title === "pharmacy"
              ? " Pharmacy or Hospital"
              : " Vendor"}
          </h3>

          <p className="text-gray-500 text-base font-normal leading-6 text-left">
            Create an account for free.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-5 text-gray mb-10">
            <div className="flex flex-col gap-[6px]">
              <label htmlFor="name">
                Business name
                <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                className="p-[10px_14px] w-full gap-2 rounded-lg border-1 border-gray-300"
                type="text"
                placeholder="Enter your business name"
                {...register("name", {
                  required: "Business Name is required",
                })}
              />
              {errors.name && (
                <span className="text-gray-500">{errors.name?.message}</span>
              )}
            </div>
            <div className="flex flex-col gap-[6px]">
              <label htmlFor="email">
                Business email
                <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                className="p-[10px_14px] w-full gap-2 rounded-lg border-1 border-gray-300"
                type="email"
                placeholder="Enter your business email"
                {...register("email", {
                  required: "Business Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <span className="text-gray-500">{errors.email?.message}</span>
              )}
            </div>
            <div className="flex flex-col gap-[6px]">
              <label htmlFor="password">
                Password
                <span className="text-red-500">*</span>
              </label>
              <div className="flex rounded-lg border-1 border-gray-300">
                <input
                  id="password"
                  className="m-[10px_14px] w-full border-none outline-none"
                  type={isVisible ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Must be at least 8 characters.",
                    },
                  })}
                />
                <button
                  className="focus:outline-none px-4"
                  type="button"
                  onClick={toggleVisibility}
                  aria-label="toggle password visibility"
                >
                  {isVisible ? (
                    <FiEyeOff className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <IoEyeOutline className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="text-gray-500">
                  {errors.password?.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-[6px]">
              <label htmlFor="confirmPassword">
                Confirm Password
                <span className="text-red-500">*</span>
              </label>
              <div className="flex rounded-lg border-1 border-gray-300">
                <input
                  className="m-[10px_14px] w-full border-none outline-none"
                  type={isConfirmVisible ? "text" : "password"}
                  placeholder="Enter your password"
                  id="confirmPassword"
                  {...register("confirmPassword", {
                    required: "Confirm Password is required",
                    validate: (val: string) => {
                      if (watch("password") != val) {
                        return "Your passwords do no match";
                      }
                    },
                  })}
                />
                <button
                  className="focus:outline-none px-4"
                  type="button"
                  onClick={toggleConfirmVisibility}
                  aria-label="toggle password visibility"
                >
                  {isConfirmVisible ? (
                    <FiEyeOff className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <IoEyeOutline className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="text-gray-500">
                  {errors.confirmPassword?.message}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-4 mb-8">
            <Button
              color="primary"
              size="lg"
              className="w-full cursor-pointer hover:bg-[#7B61FF]"
              type="submit"
            >
              Create account
            </Button>
            {title !== "vendor" && (
              <Button
                size="lg"
                variant="bordered"
                className="w-full cursor-pointer text-gray"
                startContent={<FcGoogle className="text-2xl" />}
              >
                Sign up with Google
              </Button>
            )}
          </div>
        </form>

        <div className="text-center">
          <p className="text-gray-500 text-base font-normal leading-6 ">
            Already have an account?
            <Link href="/signin" className="text-primary-500 mx-1">
              Log in
            </Link>
            or
            <Link href="/signup/vendor" className="text-primary-500 mx-1">
              Sign Up as a
              {title !== "vendor" ? " Vendor" : " Supplier or Pharmacy"}
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
