export const monthList = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export const convertDate = (date: string) => {
    const newDate = new Date(date);
    const [month, day, year] = [newDate.getMonth(), newDate.getDate(), newDate.getFullYear(), newDate.getDay()];
    const dateString = `${day} ${monthList[month]} ${year}`
    return dateString;
}

export const dateToString = (date: Date | null) => {
    if (!date) return ""; 
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); 
    const day = String(date.getDate()).padStart(2, "0");
  
    return `${year}-${month}-${day}`;
}

export const formatText = (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const convertDateWithTime = (dateString: string, includeSeconds: boolean = false): string => {
    const newDate = new Date(dateString);
    
    const month = newDate.getMonth();
    const day = newDate.getDate();
    const year = newDate.getFullYear();
    
    const hours = newDate.getHours();
    const minutes = newDate.getMinutes();
    const seconds = newDate.getSeconds();
    
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    
    const datePart = `${day} ${monthList[month]} ${year}`;
    
    const timePart = includeSeconds 
      ? `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`
      : `${formattedHours}:${formattedMinutes} ${ampm}`;
    return `${datePart}, ${timePart}`;
};
  
export const getFormattedTime = (dateString: string, includeSeconds: boolean = false): string => {
    const date = new Date(dateString);
    
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = String(minutes).padStart(2, '0');
    
    if (includeSeconds) {
      const formattedSeconds = String(seconds).padStart(2, '0');
      return `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;
    }
    
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
};