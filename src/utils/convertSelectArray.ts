export const convertArray = (arr: any) => {
    return arr?.map((item: any) => {
      return {
        label: item?.name,
        value: item?.id,
      };
    });
};