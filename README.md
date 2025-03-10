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
pages/index.tsx → Displays all test results.
pages/create.tsx → Form to add a new test result.
pages/edit/[id].tsx → Edit an existing test result.
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
git clone https://github.com/your-username/lab-results-management.git
cd lab-results-management

2️⃣ Install Dependencies
npm install

3️⃣ Set Up Environment Variables
Create a .env file in the root directory and add the following:

env
DATABASE_URL="postgresql://your_user:your_password@localhost:5432/your_database"

NEXT_PUBLIC_API_BASE_URL="http://localhost:3000/api"
Replace your_user, your_password, and your_database with actual PostgreSQL credentials.

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

Running the Frontend
Simply start the Next.js app:

npm run dev
🚀 Deployment
Deploy on Vercel
Push your code to GitHub.
Connect the repository to Vercel.
Set up environment variables in Vercel.
Deploy! 🎉
📜 Evaluation Criteria
✔️ Clean Code & Readability
✔️ Best Practices in API Development
✔️ Proper Use of Next.js, TypeScript, Prisma
✔️ Functional Frontend & Backend

📬 Submission
GitHub Repository: [Insert Link Here]
Live Demo (Vercel): [Insert Link Here]
👨‍💻 Contributing
Feel free to submit issues and pull requests to improve the project!

💡 Built with ❤️ for better healthcare management. 🚀