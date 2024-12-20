import Image from "next/image";
import noDocs from "@public/assets/images/no_document.png";

const EmptyRequest = ({
  heading,
  content,
}: {
  heading: string;
  content: string;
}) => {
  return (
    <div className="mt-24">
      <Image src={noDocs} alt="" className="mx-auto w-[146px] h-[146px]" />
      <div className="max-w-xs mx-auto mt-4 text-center">
        <h3 className="text-xl font-semibold text-gray-700">{heading}</h3>
        <p className="mt-3">{content}</p>
      </div>
    </div>
  );
};

export default EmptyRequest;
