export const beautifyOCRText = (text: string): string => {
  const lines = text.split("\n");
  const formattedLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    // Clean up common OCR noise
    line = line.replace(/[|@]/g, " ");
    line = line.replace(/ +/g, " "); // collapse multiple spaces
    line = line.replace(/ ,/g, ",");
    line = line.replace(/ :/g, ":");
    line = line.replace(/([a-zA-Z])([0-9])/g, "$1 $2"); // split letters from numbers
    line = line.replace(/([0-9])([a-zA-Z])/g, "$1 $2"); // split numbers from letters
    line = line.replace(/\[|\]/g, ""); // remove stray brackets
    line = line.replace(/[^\w\s.,:()/-]/g, ""); // remove most non-alphanumeric except punctuation

    // Add double line breaks after key section headers or prescription rows
    if (/^(Date|Name|Age|Gender|Weight|Clinical Description|Advice|Rx|Prescriptions?):?/i.test(line)) {
      formattedLines.push(""); // blank line before
      formattedLines.push(line);
      formattedLines.push(""); // blank line after
    } else {
      formattedLines.push(line);
    }
  }

  // Remove empty lines at start/end and collapse multiple empty lines
  let result = formattedLines.join("\n");
  result = result.replace(/\n{3,}/g, "\n\n");
  result = result.replace(/^\n+|\n+$/g, "");
  return result;

}