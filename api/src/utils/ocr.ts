import Tesseract from "tesseract.js";

export const performOCR = async (imagePath: string): Promise<string> => {
  const result = await Tesseract.recognize(imagePath, "eng");
  return result.data.text;
};

export const beautifyOCRText = (text: string): string => {
  const lines = text.split("\n");
  const formattedLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    line = line.replace(/[|@]/g, " ");
    line = line.replace(/ +/g, " ");
    line = line.replace(/ ,/g, ",");
    line = line.replace(/ :/g, ":");
    line = line.replace(/([a-zA-Z])([0-9])/g, "$1 $2");
    line = line.replace(/([0-9])([a-zA-Z])/g, "$1 $2");
    line = line.replace(/\[|\]/g, "");
    line = line.replace(/[^\w\s.,:()/-]/g, "");

    if (/^(Date|Name|Age|Gender|Weight|Clinical Description|Advice|Rx|Prescriptions?):?/i.test(line)) {
      formattedLines.push("");
      formattedLines.push(line);
      formattedLines.push("");
    } else {
      formattedLines.push(line);
    }
  }

  let result = formattedLines.join("\n");
  result = result.replace(/\n{3,}/g, "\n\n");
  result = result.replace(/^\n+|\n+$/g, "");
  return result;
}