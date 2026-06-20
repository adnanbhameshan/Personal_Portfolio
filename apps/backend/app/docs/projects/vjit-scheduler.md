# VJIT Sports Scheduler
source: projects/vjit-scheduler.md
category: project
last_updated: 2026-06-21

## Summary
VJIT Sports Scheduler is an academic full-stack sports session scheduler built as a B.Tech capstone project.

It replaces spreadsheet, physical-record, and notice-board coordination with a role-based platform for scheduling sessions, allocating resources, tracking participation, and reviewing sports analytics.

## Verified Technology Stack
Node.js, Express.js, PostgreSQL, Sequelize, EJS, Tailwind CSS, Passport.js, bcrypt, connect-flash, CSRF protection, Body-Parser, and CORS.

## Architecture
EJS and Tailwind CSS form the server-rendered presentation layer. Express renders role-aware admin and student dashboards, forms, session views, and reports.

Node.js and Express.js form the application layer. They handle business logic, Passport.js authentication, CSRF protection, role checks, and session/report CRUD operations.

PostgreSQL and Sequelize form the data layer. They store Users, Sessions, and Reports as relational tables with Sequelize validation and queries.

## Authentication and Security
POST /users registers a user with a bcrypt-hashed password and default non-admin role.

GET /login renders the sign-in form with a CSRF token. POST /signin authenticates through Passport.js local strategy. GET /signout ends the authenticated session.

Sequelize validation errors such as empty fields or duplicate emails are surfaced with connect-flash messages.

## Role-Based Access
The User model uses an isAdmin boolean role flag.

Admin-only route and view checks protect session creation, user management, and reports. Students see available sports and their own upcoming and past sessions.

## Data Model
Users: id, first name, last name, unique email, hashed password, role flag, and timestamps.

Sessions: id, title, date, time, location, and creator reference.

Reports: id, report date, report type, and aggregated session/participation data.

## Workflow
Users sign up and authenticate through Passport.js. The application routes them to a role-aware dashboard.

Admins create, update, or cancel sports sessions, allocate resources, manage users, and review reports. Students browse sports, join sessions, and track upcoming and past participation.

The Reports page filters participation data by date range and presents a ranked sports table and popularity chart.

## Deployment Status
The project is not deployed to production. It was built and tested locally and demonstrated in a controlled lab environment.

## Future Improvements
- Real-time notifications for new sessions, changes, and cancellations
- User feedback system
- UI and UX refinement
- Production deployment with a hosted database
- Migration from EJS to a component-based frontend such as React

TODO_VERIFY:
Confirm GitHub repository URL.
Attach the documented project screenshots.

