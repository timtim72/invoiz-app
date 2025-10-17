// utils/pdfGenerator.js

import jsPDF from 'jspdf';

// Helper function to format dates
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('fr-FR');
};

export const generateInvoicePdf = (invoiceData, companyProfile) => {
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;

  // --- 1. EN-TÊTE ---
  // Logo et nom de l'entreprise à gauche
  if (companyProfile.logo) {
    try {
      const imgFormat = companyProfile.logo.split(';')[0].split('/')[1].toUpperCase();
      doc.addImage(companyProfile.logo, imgFormat, 15, 15, 25, 25);
    } catch (e) {
      console.error("Erreur lors de l'ajout du logo au PDF:", e);
    }
  }
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(companyProfile.name || "Nom de l'entreprise", 45, 22);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(companyProfile.address || "Adresse de l'entreprise", 45, 28);

  // Mention "FACTURE" à droite
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('FACTURE', pageWidth - 15, 25, { align: 'right' });


  // --- 2. BLOCS D'INFORMATIONS ---
  const infoBlockY = 50;
  doc.setLineWidth(0.5);
  doc.line(15, infoBlockY - 5, pageWidth - 15, infoBlockY - 5); // Ligne de séparation

  // Bloc 1: Facturé à
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('FACTURÉ À', 15, infoBlockY);
  doc.setFont('helvetica', 'normal');
  doc.text(invoiceData.clientName || 'N/A', 15, infoBlockY + 5);
  // Vous pouvez ajouter l'adresse du client ici si vous la sauvegardez
  // doc.text(invoiceData.clientAddress || '', 15, infoBlockY + 10);

  // Bloc 2: Facturé par
  doc.setFont('helvetica', 'bold');
  doc.text('FACTURÉ PAR', 80, infoBlockY);
  doc.setFont('helvetica', 'normal');
  doc.text(companyProfile.name || 'N/A', 80, infoBlockY + 5);
  doc.text(companyProfile.address || '', 80, infoBlockY + 10);

  // Bloc 3: Détails de la facture
  const detailsX = 150;
  doc.setFont('helvetica', 'bold');
  doc.text('Facture #:', detailsX, infoBlockY);
  doc.text('Date :', detailsX, infoBlockY + 5);
  doc.text('Échéance :', detailsX, infoBlockY + 10);

  doc.setFont('helvetica', 'normal');
  doc.text(invoiceData.invoiceNumber || 'N/A', detailsX + 20, infoBlockY);
  doc.text(formatDate(invoiceData.createdAt), detailsX + 20, infoBlockY + 5);
  doc.text(formatDate(invoiceData.dueDate), detailsX + 20, infoBlockY + 10);
  
  doc.line(15, infoBlockY + 20, pageWidth - 15, infoBlockY + 20); // Ligne de séparation

  // --- 3. TABLEAU DES PRODUITS ---
  let tableY = infoBlockY + 30;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(230, 230, 230); // Fond gris clair pour l'en-tête
  doc.rect(15, tableY - 5, pageWidth - 30, 10, 'F');
  doc.text('Description', 20, tableY);
  doc.text('Qté', 130, tableY);
  doc.text('Prix U.', 150, tableY);
  // On décale le total vers la droite
  doc.text('Total', pageWidth - 15, tableY, { align: 'right' });
  tableY += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  (invoiceData.lineItems || []).forEach(item => {
    doc.text(item.description || '', 20, tableY);
    doc.text(String(item.quantity || 0), 130, tableY);
    doc.text(`${Number(item.price || 0).toFixed(2)} €`, 150, tableY);
    // On décale aussi le total vers la droite
    doc.text(`${((item.quantity || 0) * (item.price || 0)).toFixed(2)} €`, pageWidth - 15, tableY, { align: 'right' });
    tableY += 7;
  });

  // --- 4. TOTAUX ET SIGNATURE ---
  let totalsY = Math.max(tableY, 200); // S'assure que les totaux sont en bas
  
  // On aligne les totaux avec la nouvelle position de la colonne "Total"
  const totalsX = pageWidth - 15;
  
  doc.setFontSize(10);
  doc.text('Sous-total :', 140, totalsY);
  doc.text(`${(invoiceData.subtotal || 0).toFixed(2)} €`, totalsX, totalsY, { align: 'right' });
  totalsY += 7;
  doc.text('TVA (20%) :', 140, totalsY);
  doc.text(`${(invoiceData.tax || 0).toFixed(2)} €`, totalsX, totalsY, { align: 'right' });
  totalsY += 7;
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL :', 140, totalsY);
  doc.text(`${(invoiceData.total || 0).toFixed(2)} €`, totalsX, totalsY, { align: 'right' });

  // Placeholder pour signature
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Signature Électronique :', 15, totalsY - 10);
  doc.line(15, totalsY, 80, totalsY); // Ligne pour la signature

  // --- 5. PIED DE PAGE ---
  doc.setLineWidth(0.5);
  doc.line(15, pageHeight - 30, pageWidth - 15, pageHeight - 30);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Conditions & modalités de paiement', 15, pageHeight - 25);
  doc.setFont('helvetica', 'normal');
  doc.text('Paiement dû dans les 15 jours suivant la réception de la facture.', 15, pageHeight - 20);

  // Sauvegarder le fichier
  doc.save(`facture-${invoiceData.invoiceNumber}.pdf`);
};

