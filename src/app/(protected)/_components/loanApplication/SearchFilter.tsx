import React from 'react';
import SearchInput from '../../vendors/_components/SearchInput';
import { CiFilter } from 'react-icons/ci';

interface SearchFilterProps {
  value: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterClick?: () => void;
}

const SearchFilter = ({ value, onSearchChange, onFilterClick }: SearchFilterProps) => {
  return (
    <div className="flex items-center gap-3 mt-5">
      <SearchInput
        placeholder="Search for a loan"
        value={value}
        onChange={onSearchChange}
      />
      <div
        onClick={onFilterClick}
        className="border cursor-pointer border-gray-300 p-2 rounded-md flex items-center gap-2"
      >
        <CiFilter className="w-5 h-5" />
        <p className="text-gray-500 font-medium">Filter</p>
      </div>
    </div>
  );
};

export default SearchFilter;
