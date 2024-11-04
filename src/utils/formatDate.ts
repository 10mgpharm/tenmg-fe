export const monthList = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export const convertDate = (date: string) => {
    const newDate = new Date(date);
    const [month, day, year] = [newDate.getMonth(), newDate.getDate(), newDate.getFullYear(), newDate.getDay()];
    const dateString = `${day} ${monthList[month]} ${year}`
    return dateString;
}