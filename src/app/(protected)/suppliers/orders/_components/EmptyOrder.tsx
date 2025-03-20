import Image from "next/image";
import pills from "@public/assets/images/pills.svg";

const EmptyOrder = ({
  heading,
  content,
}: {
  heading: string;
  content: string;
}) => {
  return (
    <div className="mt-24">
      <Image src={pills} alt="" className="mx-auto" />
      <div className="max-w-xs mx-auto mt-4 text-center">
        <h3 className="text-xl font-semibold text-gray-700 capitalize">
          {heading}
        </h3>
        <p className="mt-3">{content}</p>
      </div>
    </div>
  );
};

export default EmptyOrder;
