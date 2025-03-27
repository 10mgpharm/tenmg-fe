import Image from "next/image";
import React from "react";

export default function EmptyProductScreen({
  searchValue,
}: {
  searchValue?: string;
}) {
  return (
    <section className="w-11/12 lg:w-10/12  py-20 mx-auto flex flex-col items-center justify-center gap-4">
      <Image
        src="/assets/images/emptyProductScreen.png"
        alt=""
        width={300}
        height={300}
      />

      <div>
        <p className="text-base my-2 text-center">
          {!searchValue
            ? "Haven't searched yet? Tell us what you're interested in!"
            : "Sorry, we could not find any matching results for:"}
        </p>

        {searchValue && (
          <>
            <p className="text-xl font-semibold my-4 text-center">
              {searchValue}
            </p>

            <p className="text-xl font-semibold ">Search Tips:</p>
            <ul className="ms-3">
              <li className="text-base my-1">
                - Make sure everything is spelled right.
              </li>
              <li className="text-base my-1">
                - Try using fewer or simpler words.
              </li>
              <li className="text-base my-1">
                - You can search for something more general, then narrow it down
                with filters.
              </li>
            </ul>
          </>
        )}
      </div>
    </section>
  );
}

//
// Jude Bellingham
// Search Tips:
// -
// -
// -
