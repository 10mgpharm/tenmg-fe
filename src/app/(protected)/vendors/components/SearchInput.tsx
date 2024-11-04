import React from "react";
import { CiSearch } from "react-icons/ci";

interface Props {
  placeholder: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput = ({ placeholder, onChange }: Props) => {
  return (
    <div className="border border-gray-300 rounded-md flex items-center gap-3 p-3 w-[350px]">
      <CiSearch className="w-5 h-5" />
      <input
        type="text"
        value=""
        placeholder={placeholder}
        onChange={onChange}
        className="outline-none flex-1 placeholder:text-gray-400 bg-transparent"
      />
    </div>
  );
};

export default SearchInput;
