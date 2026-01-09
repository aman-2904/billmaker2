# React GST Tax Invoice Maker

A modern React application for generating professional GST tax invoices with instant PDF download.

## Features

✅ **Modern React Architecture**
- Built with Vite + React 18
- Functional components with hooks
- Clean, modular code structure

✅ **Apple-Style Premium UI**
- Clean, minimal design
- System fonts and soft shadows
- Smooth transitions and hover effects
- Responsive layout

✅ **Pixel-Perfect Invoice PDF**
- Exact replica of reference invoice
- A4 size, black & white, print-ready
- Proper filename: `Invoice_<InvoiceNumber>.pdf`

✅ **Smart Calculations**
- Auto GST calculation (default 18%)
- Real-time totals update
- Amount to words (Indian numbering system)

✅ **Dynamic Features**
- Add/remove invoice items
- Form validation
- One-click PDF download

## Project Structure

```
src/
├── components/
│   ├── InvoiceForm.jsx      # Apple-style form UI
│   ├── ItemRow.jsx           # Dynamic item component
│   └── InvoicePreview.jsx    # Hidden invoice template
├── utils/
│   ├── gstCalculation.js     # GST calculation logic
│   └── numberToWords.js      # Indian number conversion
├── styles/
│   ├── form.css              # Apple-style form CSS
│   └── invoice.css           # Pixel-perfect invoice CSS
├── App.jsx                   # Main application
└── main.jsx                  # Entry point
```

## Installation & Running

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

The application will open at `http://localhost:5173`

### Build for Production
```bash
npm run build
```

## Usage

1. **Fill Seller Details**: Enter your company information
2. **Fill Buyer Details**: Enter customer information
3. **Enter Invoice Details**: Invoice number, date, payment mode, etc.
4. **Add Items**: Click "Add Item" to add products/services
5. **Review Totals**: Check auto-calculated GST and totals
6. **Generate PDF**: Click "Generate Invoice PDF" to download

## Technical Details

### Dependencies
- **React 18.3.1**: UI framework
- **html2pdf.js 0.10.1**: PDF generation
- **Vite**: Build tool and dev server

### Business Logic
- **Zero changes** to GST calculation formulas
- **Zero changes** to number-to-words conversion
- **Exact same** invoice layout as original

### PDF Generation
- Format: `Invoice_<InvoiceNumber>.pdf`
- Size: A4 (210mm × 297mm)
- Quality: High (scale: 2, quality: 0.98)
- Color: Black & white

## Conversion from Vanilla JS

This React application is a direct conversion from the original vanilla JavaScript invoice maker, with:

✅ **Preserved**:
- All business logic (GST calculations, validations)
- Invoice layout (pixel-perfect match)
- PDF output (same quality and filename)
- Apple-style UI design

✅ **Improved**:
- Modular component structure
- React state management
- Better code organization
- Easier to maintain and extend

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

Free to use for personal and commercial projects.
