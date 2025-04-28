import { cn } from "@/lib/utils";
import { Box, useRadio } from "@chakra-ui/react";

export const CustomRadio = (props) => {
  const { header, description, ...radioProps } = props;
  const { state, getInputProps, getRadioProps, htmlProps, getLabelProps } =
    useRadio(radioProps);

  return (
    <label {...htmlProps} className="cursor-pointer">
      <input {...getInputProps({})} />
      <Box
        {...getRadioProps()}
        onClick={() => console.log(state, getRadioProps())}
        className={cn(
          "flex flex-col gap-2 border-2 border-gray-100 p-4 w-full relative rounded-md bg-gray-50",
          state.isChecked && "bg-primary-600/5  border-primary-600"
        )}
      >
        <h3 className="text-[16px] font-semibold">{header}</h3>
        <p className="text-[14px] text-gray-600">{description}</p>
        {state.isChecked && (
          <input
            type="checkbox"
            checked={state.isChecked}
            className="accent-primary-600 pointer-events-none size-[15px] absolute right-[10px] top-[10px]"
            onChange={() => {}}
          />
        )}
      </Box>
    </label>
  );
};
