// utils/createXlsxTemplate.ts

import * as XLSX from 'xlsx';

interface HeaderMapping {
  key: string;
  header: string;
}

/**
 * Generates an XLSX template with the given headers and returns it as a Blob.
 * @param headerMappings - An array of objects mapping data keys to display names.
 * @param sheetName - The name of the worksheet.
 * @returns A Blob representing the generated XLSX file.
 */
export function createXlsxTemplate(
  headerMappings: HeaderMapping[],
  sheetName: string = 'Template'
): Blob {
  // Extract display names for the header row
  const headers = headerMappings.map((mapping) => mapping.header);

  // Define the worksheet data with headers
  const data = [headers];

  // Create a new workbook and worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(data);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Generate binary string
  const workbookBinary = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'binary',
  });

  // Convert binary string to array buffer
  const buffer = new ArrayBuffer(workbookBinary.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < workbookBinary.length; i++) {
    view[i] = workbookBinary.charCodeAt(i) & 0xff;
  }

  // Create a Blob from the array buffer
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  return blob;
}
