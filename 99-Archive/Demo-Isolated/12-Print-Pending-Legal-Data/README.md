# Transactional & legal print documents — pending real data

Quotation, tax invoice, payment receipt voucher, the SPA contract cover and the event badge were designed with sample buyers, units and prices from the fictional demo project. They were isolated on 2026-10-13. Two reasons:
- **No fiction:** they must not show invented people, units or prices.
- **Missing legal data:** they cannot be issued without the company's real legal details (CR number, VATIN, registered address, bank account), which are not yet provided.

**To reinstate:**
1. Finance/Legal provide the data in `00-Brand-Foundation/brand.config.json` and `12-Print/Source/print.config.json`.
2. Replace the sample content with «سراج» data.
3. Move the sources back to `12-Print/Source/` and add the jobs back in `tools/build-print.js`.
