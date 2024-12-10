import * as XLSX from 'xlsx';

interface HeaderChange {
  original: string;   
  updated: string;    
}

/**
 * Reads an XLSX file from a File object, changes specified headers, and returns a Blob of the updated file.
 * @param file - The input XLSX file as a File object.
 * @param headersToChange - An array of objects defining which headers to change.
 * @returns A Promise that resolves to a Blob representing the updated XLSX file.
 */
export async function changeXlsxHeaders(
  file: File,
  headersToChange: HeaderChange[]
): Promise<Blob> {
  // Convert File to ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();

  // Read workbook from the ArrayBuffer
  const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  // Extract sheet data as a 2D array (AOA)
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as (string | number)[][];

  if (data.length === 0) {
    // If the file is empty or has no rows, just return it as is
    return file as unknown as Blob;
  }

  // data[0] should be the header row
  const headers = data[0].map((header) => (typeof header === 'string' ? header : String(header)));

  // Change the headers based on provided mappings
  const updatedHeaders = headers.map((header) => {
    // Find a matching change object (case-insensitive)
    const foundChange = headersToChange.find(
      (change) => header.trim().toLowerCase() === change.original.trim().toLowerCase()
    );
    return foundChange ? foundChange.updated : header;
  });

  // Update the data with the changed headers
  data[0] = updatedHeaders;

  // Convert data back to a worksheet
  const newWorksheet = XLSX.utils.aoa_to_sheet(data);
  workbook.Sheets[firstSheetName] = newWorksheet;

  // Write updated workbook to a binary string
  const workbookBinary = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });

  // Convert binary string to ArrayBuffer
  const buffer = new ArrayBuffer(workbookBinary.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < workbookBinary.length; i++) {
    view[i] = workbookBinary.charCodeAt(i) & 0xFF;
  }

  // Create a Blob from the array buffer
  const updatedBlob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  return updatedBlob;
}
