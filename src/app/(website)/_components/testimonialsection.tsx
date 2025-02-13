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
              <button className="px-6 py-3 bg-[#FFFFFF] text-[#344054] rounded-lg hover:bg-[#D0D5DD]">
                Contact Us
              </button>
              <button className="px-6 py-3 bg-[#1866A7] text-[#FFFFFF] rounded-lg hover:bg-gray-300">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Testimonialsection;

