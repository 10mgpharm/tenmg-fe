"use client";

import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import { StylesConfig } from "react-select/dist/declarations/src/styles";

export interface CreatableSelectOption {
  value: string;
  label: string;
  newOption?: boolean;
  id?: number;
}

interface CustomSelectProps {
  name: string;
  placeholder: string;
  defaultValue?: string | null;
  onOptionSelected: (selectedOption: CreatableSelectOption) => void;
  options: CreatableSelectOption[];
  isDisabled?: boolean;
  value?: string;
  error?: string;
  isLoading?: boolean;
}

export default function CustomCreatableSelectComponent({
  onOptionSelected,
  options,
  value,
  placeholder,
  error,
  name,
  isDisabled,
  defaultValue,
  isLoading,
}: CustomSelectProps) {
  const [optionList, setOptionList] = useState(options);
  const [selectedOption, setSelectedOption] =
    useState<CreatableSelectOption>(null);

  const handleCreateOption = (newValue) => {
    const newOption = { value: newValue, label: newValue, newOption: true };
    setOptionList([...optionList, newOption]);
    setSelectedOption(newOption);
    onOptionSelected(newOption);
  };

  const handleChange = (option) => {
    setSelectedOption(option);
    onOptionSelected(option);
  };

  useEffect(() => {
    // handle initialization for re-rendering if value exist
    if (value) {
      const selected = optionList?.find((option) => option.label === value);
      if (selected) {
        setSelectedOption(selected);
      } else {
        setSelectedOption({ value, label: value });
      }
    }
    if (options) {
      setOptionList(options);
    }
  }, [value, optionList, options, defaultValue]);

  return (
    <div className="w-full">
      <CreatableSelect
        name={name}
        className={name}
        id={name}
        value={selectedOption}
        onChange={handleChange}
        isDisabled={isDisabled}
        onCreateOption={handleCreateOption}
        options={optionList}
        menuPortalTarget={document.body}
        isLoading={isLoading}
        styles={{
          ...customStyles(!!error),
          input: (base) => ({
            ...base,
            marginLeft: "8px", // padding for the input field
            fontSize: "16px", // match font size
          }),
          option: (base, state) => ({
            ...base,
            color: state.isSelected ? "white" : "#212121",
            padding: "10px 12px",
            fontSize: "16px",
            fontWeight: state.isSelected ? "bold" : "normal",
            cursor: "pointer",
          }),
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        }}
        placeholder={placeholder}
      />
    </div>
  );
}

export const customStyles = (hasError: boolean = false): StylesConfig => ({
  control: (base, state) => ({
    ...base,
    borderColor: hasError
      ? "red"
      : state.isFocused
      ? "#212121"
      : state.isDisabled
      ? "0 0 0 1px gray"
      : "rgb(214 221 235 / 1)",
    borderWidth: "1px",
    borderRadius: "4px",
    background: "transparent",
    boxShadow: hasError
      ? "red"
      : state.isFocused
      ? "0 0 0 1px #212121"
      : "none",
    padding: "0px", // remove padding
    minHeight: "40px", // height to match the input
    "&:hover": {
      // borderColor: '#E2E8F0', // no change on hover
    },
  }),
  placeholder: (base) => ({
    ...base,
    color: "#A8ADB7",
    fontSize: "14px",
    marginLeft: "8px",
  }),
  valueContainer: (base) => ({
    ...base,
    paddingLeft: "8px", // left padding for the selected value
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: "#6B7280", // arrow color
    padding: "8px", // space around the arrow
  }),
  indicatorSeparator: (base) => ({
    ...base,
    display: "none", // removes the separator before the caret
  }),
  input: (base) => ({
    ...base,
    marginLeft: "8px", // padding for the input field
    fontSize: "14px", // match font size
  }),
  singleValue: (base) => ({
    ...base,
    fontSize: "14px", // font size for selected value
  }),
});

export const borderLessCustomStyles: StylesConfig = {
  control: (base, state) => ({
    ...base,
    borderColor: "transparent", // No border
    boxShadow: "none", // No shadow
    borderWidth: "0px", // Remove the border width
    padding: "0px", // remove padding
    minHeight: "40px", // height to match the input
    "&:hover": {
      borderColor: "transparent", // No border on hover
    },
  }),
  placeholder: (base) => ({
    ...base,
    color: "#A8ADB7",
    fontSize: "14px",
    marginLeft: "8px",
  }),
  valueContainer: (base) => ({
    ...base,
    paddingLeft: "8px", // left padding for the selected value
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: "#6B7280", // arrow color
    padding: "8px", // space around the arrow
  }),
  indicatorSeparator: () => ({
    display: "none", // removes the separator before the caret
  }),
  input: (base) => ({
    ...base,
    marginLeft: "0px", // padding for the input field
    fontSize: "14px", // match font size
  }),
  singleValue: (base) => ({
    ...base,
    fontSize: "14px", // font size for selected value
  }),
};
