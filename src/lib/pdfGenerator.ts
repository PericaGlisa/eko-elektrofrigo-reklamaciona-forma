import jsPDF from "jspdf";
import "jspdf-autotable";
import { ComplaintFormData } from "./formSchema";
import { COMPANY } from "./companyInfo";
import ekoLogoUrl from "@/assets/eko-logo.png";

// Convert image to base64
const getLogoBase64 = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("No canvas context");
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = ekoLogoUrl;
  });
};

// Fetch font and convert to base64
const getFontBase64 = async (url: string): Promise<string> => {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

const convertDataUrlToJpeg = (dataUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context not available"));
        return;
      }
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.92));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
};

const addDataUrlImage = async (
  doc: jsPDF,
  dataUrl: string | undefined,
  x: number,
  y: number,
  w: number,
  h: number
) => {
  if (!dataUrl || !dataUrl.startsWith("data:image/")) {
    console.warn("Invalid signature data URL:", dataUrl?.substring(0, 50));
    return;
  }

  const isJpeg = dataUrl.startsWith("data:image/jpeg") || dataUrl.startsWith("data:image/jpg");
  const primaryFormat = isJpeg ? "JPEG" : "PNG";

  try {
    console.log(`Attempting to add image (${primaryFormat})`);
    doc.addImage(dataUrl, primaryFormat, x, y, w, h);
    console.log("Image added successfully on first try");
    return;
  } catch (err) {
    console.warn("First attempt to add image failed:", err);
  }

  try {
    console.log("Attempting to convert to JPEG and add image");
    const jpegDataUrl = await convertDataUrlToJpeg(dataUrl);
    doc.addImage(jpegDataUrl, "JPEG", x, y, w, h);
    console.log("Image added successfully after JPEG conversion");
  } catch (err) {
    console.error("Failed to add image even after conversion:", err);
  }
};

export const generatePDF = async (data: ComplaintFormData) => {
  const doc = new jsPDF("p", "mm", "a4");
  
  // Add custom font for Serbian Latin support
  try {
    const fontRegularBase64 = await getFontBase64("https://cdn.jsdelivr.net/npm/roboto-font@0.1.0/fonts/Roboto/roboto-regular-webfont.ttf");
    const fontBoldBase64 = await getFontBase64("https://cdn.jsdelivr.net/npm/roboto-font@0.1.0/fonts/Roboto/roboto-bold-webfont.ttf");
    
    doc.addFileToVFS("Roboto-Regular.ttf", fontRegularBase64);
    doc.addFileToVFS("Roboto-Bold.ttf", fontBoldBase64);
    
    doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
    doc.addFont("Roboto-Bold.ttf", "Roboto", "bold");
    
    doc.setFont("Roboto");
  } catch (e) {
    console.error("Failed to load custom font, falling back to standard font", e);
  }

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  let y = 15;

  // Colors
  const primaryColor: [number, number, number] = [40, 180, 75]; // EKO Green
  const secondaryColor: [number, number, number] = [30, 100, 200]; // Brand Blue
  const grayColor: [number, number, number] = [100, 100, 100];

  // Logo
  try {
    const logoBase64 = await getLogoBase64();
    doc.addImage(logoBase64, "PNG", margin, y, 35, 14);
  } catch {
    // fallback: no logo
  }

  // Company header - right side
  doc.setFontSize(8);
  doc.setTextColor(...grayColor);
  const headerX = pageWidth - margin;
  doc.setFont("Roboto", "bold");
  doc.text(COMPANY.name, headerX, y + 2, { align: "right" });
  doc.setFont("Roboto", "normal");
  doc.text(`PIB: ${COMPANY.pib} | MB: ${COMPANY.mb}`, headerX, y + 5.5, { align: "right" });
  doc.text("Svetolika Nikačevića 11, Beograd, Srbija", headerX, y + 9, { align: "right" });
  doc.text(`Tel: ${COMPANY.tel.join(" / ")} | Fax: ${COMPANY.fax}`, headerX, y + 12.5, { align: "right" });

  y += 20;

  // Divider
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.8);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Title
  doc.setFontSize(18);
  doc.setTextColor(...primaryColor);
  doc.setFont("Roboto", "bold");
  doc.text("REKLAMACIONI LIST", pageWidth / 2, y, { align: "center" });
  y += 10;

  // Helper functions
  const addSectionTitle = (title: string) => {
    if (y > 260) { doc.addPage(); y = 20; }
    doc.setFillColor(...primaryColor);
    doc.rect(margin, y, pageWidth - 2 * margin, 7, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("Roboto", "bold");
    doc.text(title, margin + 3, y + 5);
    y += 11;
    doc.setTextColor(0, 0, 0);
    doc.setFont("Roboto", "normal");
  };

  const addField = (label: string, value: string | undefined) => {
    if (y > 275) { doc.addPage(); y = 20; }
    doc.setFontSize(9);
    doc.setTextColor(...grayColor);
    doc.text(label + ":", margin, y);
    doc.setTextColor(0, 0, 0);
    doc.setFont("Roboto", "bold");
    doc.text(value || "—", margin + 50, y);
    doc.setFont("Roboto", "normal");
    y += 6;
  };

  const addTextBlock = (label: string, value: string | undefined) => {
    if (y > 260) { doc.addPage(); y = 20; }
    doc.setFontSize(9);
    doc.setTextColor(...grayColor);
    doc.text(label + ":", margin, y);
    y += 5;
    doc.setTextColor(0, 0, 0);
    const lines = doc.splitTextToSize(value || "—", pageWidth - 2 * margin);
    for (const line of lines) {
      if (y > 280) { doc.addPage(); y = 20; }
      doc.text(line, margin, y);
      y += 4.5;
    }
    y += 3;
  };

  // Section: General Info
  addSectionTitle("OPŠTI PODACI");
  addField("Broj reklamacije", data.complaintNumber);
  addField("Datum prijema", data.receptionDate);
  addField("Naziv kupca", data.customerName);
  addField("Adresa", data.address);
  addField("Telefon", data.contactPhone);
  addField("Email", data.contactEmail);
  y += 3;

  // Section: Categories
  addSectionTitle("KATEGORIJA PROIZVODA");
  const cats = [...(data.categories || [])];
  if (data.categoryOther) cats.push(`Ostalo: ${data.categoryOther}`);
  if (cats.length > 0) {
    doc.setFontSize(9);
    cats.forEach((cat) => {
      if (y > 275) { doc.addPage(); y = 20; }
      doc.setTextColor(...secondaryColor);
      doc.text("✓", margin, y);
      doc.setTextColor(0, 0, 0);
      doc.text(cat, margin + 5, y);
      y += 5;
    });
  } else {
    doc.setFontSize(9);
    doc.text("Nije odabrano", margin, y);
    y += 5;
  }
  y += 3;

  // Section: Product info
  addSectionTitle("PODACI O PROIZVODU");
  addField("Proizvođač / Brend", data.manufacturer);
  addField("Model", data.model);
  addField("Serijski broj", data.serialNumber);
  addField("Datum kupovine", data.purchaseDate);
  y += 3;

  // Section: Description
  addSectionTitle("OPIS REKLAMACIJE");
  addTextBlock("Opis reklamacije / kvara", data.complaintDescription);
  addTextBlock("Servisni nalaz / tehnička analiza", data.serviceFindings);

  // Section: Warranty
  addSectionTitle("GARANCIJA");
  doc.setFontSize(9);
  const warrantyText = data.warrantyStatus === "in_warranty" ? "Zahtev kupca: Prijava reklamacije u garantnom roku" : "Zahtev kupca: Prijava kvara van garantnog roka";
  doc.setTextColor(...primaryColor);
  doc.setFont("Roboto", "bold");
  doc.text(warrantyText, margin, y);
  doc.setFont("Roboto", "normal");
  doc.setTextColor(0, 0, 0);
  y += 8;

  // Section: Signatures
  if (y > 220) { doc.addPage(); y = 20; }
  
  doc.setFillColor(...primaryColor);
  doc.rect(margin, y, pageWidth - 2 * margin, 7, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("Roboto", "bold");
  doc.text("POTPISI", margin + 3, y + 5);
  y += 15;

  const colWidth = (pageWidth - 2 * margin) / 3;
  const sigY = y;

  // Customer signature
  doc.setFontSize(9);
  doc.setTextColor(...grayColor);
  doc.text("Potpis kupca:", margin, sigY);
  
  await addDataUrlImage(doc, data.customerSignatureImage, margin, sigY + 2, 40, 20);
  
  doc.setDrawColor(...grayColor);
  doc.setLineWidth(0.5);
  doc.line(margin, sigY + 25, margin + colWidth - 10, sigY + 25);
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.text(data.customerSignature || "", margin, sigY + 30);

  // Service signature
  const serviceX = margin + colWidth;
  doc.setFontSize(9);
  doc.setTextColor(...grayColor);
  doc.text("Potpis servisera:", serviceX, sigY);

  await addDataUrlImage(doc, data.serviceSignatureImage, serviceX, sigY + 2, 40, 20);

  doc.setDrawColor(...grayColor); // Ensure draw color is reset
  doc.line(serviceX, sigY + 25, serviceX + colWidth - 10, sigY + 25);
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.text(data.serviceSignature || "", serviceX, sigY + 30);

  // Company stamp
  const stampX = margin + 2 * colWidth;
  doc.setFontSize(9);
  doc.setTextColor(...grayColor);
  doc.text("M.P. (Pečat firme)", stampX, sigY);
  
  doc.setDrawColor(...grayColor);
  doc.setLineWidth(0.3);
  doc.rect(stampX, sigY + 5, colWidth - 10, 20);

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 10;
  doc.setFontSize(7);
  doc.setTextColor(...grayColor);
  doc.text(
    `Datum štampe: ${new Date().toLocaleDateString("sr-Latn-RS")} | ${COMPANY.name} | ${COMPANY.web}`,
    pageWidth / 2,
    footerY,
    { align: "center" }
  );

  doc.save(`Reklamacija_${data.complaintNumber || "draft"}.pdf`);
};
