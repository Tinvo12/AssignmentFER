import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Export invoice PDF in English (no Unicode)
export function exportInvoicePDF(order, customerInfo = {}) {
  const doc = new jsPDF({ font: 'helvetica', unit: 'mm', format: 'a4' });
  doc.setFont('helvetica', '');

  // Header
  doc.setFontSize(16);
  doc.setTextColor(40, 40, 40);
  doc.text('HIEU NA CONSTRUCTION MATERIALS STORE', 15, 18, { maxWidth: 180 });
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text('Supplying: Steel, Cement, Brick, Sand, Stone, etc.', 15, 25);
  doc.text('Address: QL 1A, Thon Quan Chau, Hoa Xuan Ward, Da Nang City', 15, 30);
  doc.text('Phone: 0896.202.311', 15, 35);

  // Invoice title
  doc.setFontSize(18);
  doc.setTextColor(200, 0, 0);
  doc.text('RETAIL INVOICE', 80, 45);

  // Customer & order info
  doc.setFontSize(11);
  doc.setTextColor(40, 40, 40);
  doc.text(`Customer: ${customerInfo.name || order.user || ''}`, 15, 55);
  doc.text(`Address: ${customerInfo.address || ''}`, 15, 61);
  doc.text(`Phone: ${customerInfo.phone || ''}`, 120, 55);
  doc.text(`Order No: ${order.id}`, 170, 55);

  // Product table
  const tableBody = order.items.map((item, idx) => [
    idx + 1,
    item.name,
    item.unit || '',
    item.quantity,
    item.price ? item.price.toLocaleString() : '',
    (item.price * item.quantity).toLocaleString()
  ]);

  doc.autoTable({
    head: [[
      'No', 'Product', 'Unit', 'Qty', 'Unit Price', 'Amount'
    ]],
    body: tableBody,
    startY: 70,
    theme: 'grid',
    headStyles: { fillColor: [220, 0, 0], textColor: 255, fontStyle: 'bold', fontSize: 11 },
    styles: { fontSize: 10, cellPadding: 2, font: 'helvetica' },
    bodyStyles: { textColor: 40 },
    columnStyles: {
      0: { cellWidth: 12 },
      1: { cellWidth: 50 },
      2: { cellWidth: 18 },
      3: { cellWidth: 22 },
      4: { cellWidth: 28 },
      5: { cellWidth: 30 },
    },
    margin: { left: 15, right: 15 },
  });

  // Total
  const finalY = doc.lastAutoTable.finalY;
  doc.setFontSize(13);
  doc.setTextColor(0, 0, 0);
  doc.text('TOTAL:', 140, finalY + 10);
  doc.setTextColor(200, 0, 0);
  doc.text(`${order.total ? order.total.toLocaleString() : 0} VND`, 170, finalY + 10);

  // Shipping info (if any)
  if (order.shipping) {
    doc.setFontSize(10);
    doc.setTextColor(40, 40, 40);
    doc.text(
      `Shipping: ${order.shipping.vehicleType} - ${order.shipping.km} km - Fee: ${order.shipping.shippingFee.toLocaleString()} VND`,
      15,
      finalY + 18
    );
  }

  // Date, signature
  const date = order.createdAt ? new Date(order.createdAt) : new Date();
  const dateStr = `Date: ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  doc.setFontSize(11);
  doc.setTextColor(40, 40, 40);
  doc.text(dateStr, 15, finalY + 28);

  // Signature
  doc.setFontSize(10);
  doc.text('Customer\n(Sign & Full Name)', 20, finalY + 45);
  doc.text('Seller\n(Sign & Full Name)', 140, finalY + 45);

  doc.save(`invoice_${order.id}.pdf`);
}
