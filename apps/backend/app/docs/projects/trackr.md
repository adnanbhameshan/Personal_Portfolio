# Trackr - Job Analyzer
source: projects/trackr.md
category: project
last_updated: 2026-06-21

## Summary
Trackr is a full-stack job application analyzer that transforms manual job tracking into a structured, analytical workflow.

It centralizes job applications, supports lifecycle CRUD operations, visualizes pipeline and conversion metrics, and uses secure JWT authentication. Its Resume Analyzer and Job Matching Engine compares resume content with a target job description using TF-IDF and Cosine Similarity.

## Main Application Architecture
Trackr follows a three-tier client-server architecture using the MERN stack.

The presentation layer uses React 19 with Vite, Tailwind CSS, React Router DOM v7, Recharts, Axios, and Lucide React.

The application layer uses Node.js and Express.js for business logic, JWT authentication, API handling, and validation.

The data layer uses MongoDB Atlas with Mongoose schemas.

## Verified Technology Stack
Frontend: React 19, Vite, Tailwind CSS, React Router DOM v7, Recharts, Axios, and Lucide React.

Backend: Node.js, Express.js, Mongoose, JWT, bcryptjs, CORS, Cookie-parser, and Nodemailer.

NLP service: FastAPI, Python, TF-IDF Vectorization, and Cosine Similarity.

Deployment: Vercel for the frontend, Render for the backend, and MongoDB Atlas for the database.

GitHub repository: https://github.com/adnanbhameshan/Trackr-a-job-analyzer

Live frontend: https://job-analyzer-blue.vercel.app

## Authentication Flow
Trackr uses JWT for stateless authentication.

The user submits credentials, the backend validates them, and a JWT is returned to the client. The client stores the token in a cookie or localStorage and includes it with future requests. Protected API calls verify the token before granting access.

Passwords are hashed with bcryptjs.

Authentication endpoints:
- POST /register
- POST /login
- POST /logout
- GET /profile

## Job Management and Analytics
Users can create, view, update, and delete job applications.

Job endpoints:
- GET /jobs
- POST /jobs
- PUT /jobs/:id
- DELETE /jobs/:id
- GET /jobs/dashboard

The dashboard displays total applications, interviews, offers, rejections, application-pipeline charts, interview rate, success rate, and recent activity.

## Database Design
MongoDB has two primary collections managed through Mongoose.

Users fields: _id, name, unique email, hashed password, and timestamps.

Jobs fields: _id, user reference, company, position, status, and timestamps.

Documented job statuses are Applied, Offer, Interview, and Rejected.

## Resume Analyzer and Job Matching Engine
The user uploads a resume and provides a target job description. The system extracts and processes the resume content, cleans both documents, and transforms them into machine-readable vectors with TF-IDF.

Cosine Similarity measures alignment between the resume and job description. The platform returns a compatibility score showing how closely the candidate profile matches the role.

The FastAPI NLP layer is separate from the Express application backend so AI operations remain maintainable and can scale independently.

## Future Enhancements
- Skill gap analysis
- Resume improvement suggestions
- AI-generated interview preparation tips
- Job recommendation engine
- Transformer-based semantic matching
- Automatic job scraping from LinkedIn and Naukri
- Email alerts and reminders
- OAuth through Google or LinkedIn

