# Product Requirements Document (PRD) - Purnama Gym SaaS
**Version:** 4.63 (System Documentation Audit)
**Module:** System Documentation (`README.md` & `architecture.md`)

## 1. Problem Statement
The application has undergone massive, rapid iterations today, introducing enterprise-grade UI/UX refinements, a Unified CRM approach, fault-tolerant database operations, and advanced scheduling visibility. The core documentation (`README.md` and `architecture.md`) is now outdated and must be audited to reflect these sophisticated architectural decisions and new operational features.

## 2. Required Action Plan for AI Agent
Execute a comprehensive documentation audit and update. **Do NOT output raw code blocks in your response; directly update the Markdown files in the repository.**

### A. Update `README.md` (Features Section)
Add the following newly implemented capabilities to the Features list:
- **Unified Member CRM:** Centralized management for both long-term VIPs and 1-Day Daily Visits ("Visit Harian") with an integrated profile sync/biodata viewer to prevent data entry redundancy at the cashier.
- **Future Session Monitoring:** Advanced calendar integration in the Personal Trainer module, allowing admins to break out of the "Today-only" view and monitor/manage slot availability for future dates.
- **Dynamic Sales Channels:** Dedicated CRUD pipeline for "Visit Harian" alongside VIP packages, mapped seamlessly to the frontend Member app.

### B. Update `architecture.md` (Technical Decisions)
Add a new section detailing these critical architectural solutions:
- **Fault-Tolerant Deletions & Foreign Key Protection:** Document the strategy for deleting staff/trainers. Instead of performing a hard Prisma `.delete()` which would violate `RESTRICT` foreign key constraints on historical transactions, the system safely intercepts Auth Provider (Clerk) deletions and performs a Prisma Role Downgrade (`role: 'MEMBER'`). This achieves a "Soft Delete" that preserves financial integrity.
- **Pagination-Aware Indexing:** Document the mathematical formula used across financial and operational tables (`(currentPage - 1) * itemsPerPage + index + 1`) to ensure sequential row numbering remains accurate across global pagination states.
- **Daily Visit Data Modeling:** Document the efficient use of the `durationMonths === 0` logic to distinguish and categorize 1-day passes without requiring complex database schema migrations.

## 3. Expected Outcome
Both `README.md` and `architecture.md` accurately capture the advanced state of the Purnama Gym SaaS. The documentation highlights the project's resilience, smart database relationships, and highly polished user experience.