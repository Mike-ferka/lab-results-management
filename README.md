🏥 Lab Results Management System

A Next.js application for efficiently managing diagnostic test results in medical laboratories. The system allows laboratories to create, read, update, and delete test results, ensuring organized and accessible records.

🏗️ Architecture
The Lab Results Management System follows a structured full-stack architecture using Next.js API routes for backend operations and a React-based frontend for user interactions.

📌 Backend (API & Database)
Next.js API Routes: Handles CRUD operations for diagnostic test results.
Prisma ORM: Interfaces with the PostgreSQL database.
Zod Validation: Ensures valid input data for API requests.
Database Schema (Prisma Model):

model DiagnosticTest {
  id           Int     @id @default(autoincrement())
  patientName  String
  testType     String
  result       String
  testDate     DateTime
  notes        String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

🎨 Frontend (React & Tailwind CSS)
Next.js Pages & Components:
pages.tsx → Displays all test results.

Tailwind CSS: Styles the UI for a modern, responsive design.

API Calls: Uses Next.js's fetch to interact with the backend.
🔄 Data Flow
1️⃣ User submits a new test result via the frontend.
2️⃣ Next.js API Routes validate the data and send it to PostgreSQL using Prisma.
3️⃣ The database stores the result and returns a response.
4️⃣ The frontend updates the UI to reflect changes.

🚀 Features
CRUD Operations for managing diagnostic test results.
PostgreSQL Database using Prisma ORM.
Next.js API Routes for backend functionality.
Zod Validation for ensuring data integrity.
Tailwind CSS for a responsive and clean UI.

📌 Tech Stack
Next.js (React + API routes)
TypeScript
Prisma ORM
PostgreSQL
Zod (for validation)
Tailwind CSS

🛠️ Setup Instructions
1️⃣ Clone the Repository
git clone https://github.com/Mike-ferka/lab-results-management.git
cd lab-results-management

2️⃣ Install Dependencies
npm install

3️⃣ Set Up Environment Variables
Create a .env file in the root directory and add the following:
Create a new database on Neon and copy and paste the DATABASE_URL in the .env file as below

env
DATABASE_URL="postgresql://your_user:your_password@localhost:5432/your_database"



4️⃣ Initialize Prisma

npx prisma migrate dev --name init
npx prisma generate
5️⃣ Start the Development Server

npm run dev
The app will be available at http://localhost:3000.

📖 API Endpoints
✅ Create a Diagnostic Test Result
Endpoint: POST /api/tests
Description: Adds a new test result.
Request Body:

{
  "patientName": "John Doe",
  "testType": "Blood Test",
  "result": "Positive",
  "testDate": "2025-03-10",
  "notes": "Follow-up required"
}
Response:

{
  "id": 1,
  "patientName": "John Doe",
  "testType": "Blood Test",
  "result": "Positive",
  "testDate": "2025-03-10",
  "notes": "Follow-up required"
}

📌 Get All Test Results
Endpoint: GET /api/tests
Description: Retrieves all stored test results.

🔍 Get a Test Result by ID
Endpoint: GET /api/tests/:id
Description: Retrieves a single test result by ID.
✏️ Update a Test Result
Endpoint: PUT /api/tests/:id
Description: Updates an existing test result.
Request Body (any updatable field):

{
  "result": "Negative",
  "notes": "Retest in two weeks"
}

🗑️ Delete a Test Result
Endpoint: DELETE /api/tests/:id
Description: Deletes a test result from the database.

🎨 Frontend UI
The UI allows users to:
✅ Add new test results
📜 View all test results in a list
✏️ Edit or 🗑 Delete test results

