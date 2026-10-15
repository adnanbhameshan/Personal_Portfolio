# Trackr

## Summary

Trackr is a full-stack job application analyzer and tracker. It centralizes job applications, lifecycle CRUD workflows, dashboard analytics, and resume-to-job matching in one product flow.

## Problem

Job seekers often track applications across spreadsheets, emails, job boards, and manually saved resume versions. This makes it difficult to understand pipeline status, follow-ups, and whether a resume aligns with a role description.

## Solution

Trackr provides an authenticated dashboard where users can save job opportunities, manage application status, review analytics, and compare a resume against a job description using a dedicated Python matching service.

## Verified Stack

- Frontend: React 19, Vite, Tailwind CSS, React Router DOM v7, Recharts, Axios, and Lucide React
- Application backend: Node.js, Express.js, Mongoose, MongoDB Atlas, JWT, and bcryptjs
- Matching service: FastAPI and Python
- Matching algorithm: pure-Python TF-IDF and cosine similarity

## Architecture

The React client owns the user interface, protected routes, job workflow screens, and analytics views. The Express API handles authentication, authorization, protected job CRUD endpoints, and database operations through Mongoose. MongoDB stores users and job records. A separate FastAPI service owns resume analysis, text preprocessing, and matching so the Python workload remains isolated from the main Node.js API.

## Authentication and Data Access

- Users authenticate through JWT-based sessions.
- Passwords are hashed with bcryptjs.
- Protected job APIs are scoped to the authenticated user.
- Application records are isolated per user instead of shared globally.

## Job Management Workflow

Trackr supports core job application lifecycle actions:

- Add and update job applications
- Track company, role, status, and application details
- Move applications through status stages
- Review dashboard analytics through chart-based summaries
- Keep application data centralized for follow-up planning

## Resume Analyzer

The resume analyzer compares resume content against a job description. The matching service tokenizes text, uses unigrams and bigrams, calculates TF-IDF vectors, and returns cosine similarity output as a compatibility signal.

The implementation is documented as a pure-Python TF-IDF and cosine similarity workflow. It does not depend on scikit-learn.

## Engineering Decisions

- React and Vite keep the frontend fast and modular.
- Express and Mongoose provide a familiar REST API layer over MongoDB.
- JWT and bcryptjs keep authentication practical for a portfolio-grade product.
- FastAPI separates Python-based NLP logic from the Node.js application backend.
- Recharts turns stored application records into recruiter-friendly dashboard analytics.

## Links

- Repository: https://github.com/adnanbhameshan/Trackr-a-job-analyzer
- Live frontend: https://job-analyzer-blue.vercel.app

Deployment details beyond the available links should not be inferred from source code alone.
