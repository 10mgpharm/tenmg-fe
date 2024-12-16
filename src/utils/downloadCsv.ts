export function downloadCsv(csvString: string, filename: string = "data.csv") {
    // Convert the CSV string to a Blob
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    
    // Create a temporary URL for the Blob
    const url = URL.createObjectURL(blob);
  
    // Create a link element
    const a = document.createElement("a");
    a.href = url;
    a.setAttribute("download", filename);
    a.style.display = "none";
    
    // Append the link to the document and trigger a click
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  