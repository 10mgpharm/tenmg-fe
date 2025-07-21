import { Button } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

const Testimonialsection = () => {
  return (
    <div>
      {/* TestimonialSection */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-[#F9FAFB]">
        <div className="container mx-auto">
          {/* Call to Action */}
          <div className="text-center mt-12">
            <h2 className="text-2xl font-bold text-[#101828] mb-4">
              Want to give it a try? Join Us Today
            </h2>
            <p className="text-xl text-[#667085] font-Onest mb-6">
              Your Healthcare Financing Partner Starts Here
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant={"ghost"}>Contact Us</Button>
              <Link href="/auth/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Testimonialsection;
