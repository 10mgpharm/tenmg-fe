export const convertArray = (arr: any) => {
    return arr?.map((item: any) => {
      return {
        label: item?.name,
        value: item?.id,
      };
    });
};
export const convertCreateOptionArray = (arr: any) => {
    return arr?.map((item: any) => {
      return {
        label: item?.name,
        value: item?.name,
        id: item?.id
      };
    });
};

export const convertVariationArray = (arr: any) => {
    return arr?.map((item: any) => {
      return {
        label: item?.label,
        value: item?.value,
        detail: item?.detail
      };
    });
};