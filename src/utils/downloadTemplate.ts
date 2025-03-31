import { saveAs } from "file-saver";

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

/**
 * Hook to download a file from base64 encoded data.
 *
 * @param fileData - Base64 encoded string representing the file content.
 * @param fileName - Name of the file to download (without extension).
 */
export const downloadExcel = (data: string, fileName: string) => {
  // Create a Blob from the binary data
  const blob = new Blob([data], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  // Save the file
  saveAs(blob, `${fileName}.xlsx`);
};