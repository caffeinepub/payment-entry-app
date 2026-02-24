# Specification

## Summary
**Goal:** Build a mobile-optimized payment entry application with dynamic form fields based on payment mode (NEFT or Cheque) and Excel export functionality.

**Planned changes:**
- Create payment entry form with Customer Invoice Number field and Payment Mode dropdown (NEFT/Cheque)
- Dynamically show NEFT fields (Transaction ID/UTR Number, Amount, Date) when NEFT is selected
- Dynamically show Cheque fields (Bank Name, Cheque Number, Cheque Amount, Cheque Date) when Cheque is selected
- Store payment records in backend with all payment mode fields
- Clear form automatically after successful submission
- Display all saved payment records in a table in the Report section
- Add Download Excel button to export all payment records to Excel file
- Implement mobile-first responsive design with white and light grey theme, large touch-optimized inputs, and minimal UI for fast loading on low-end Android phones

**User-visible outcome:** Users can enter payment information through a dynamic form that adapts based on payment mode, view all saved payment records in a table, and export the complete payment history to Excel. The application is optimized for mobile devices with a clean, fast-loading interface.
