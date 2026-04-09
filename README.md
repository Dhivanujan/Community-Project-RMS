# Community-Project-RMS

The Results Management System (RMS) is a web-based application designed for the Faculty of Computing to efficiently manage, analyze, and visualize student academic results. The system streamlines the entire results processing workflow—from data entry to performance analysis—while ensuring accuracy, consistency, and accessibility.

## Key Features

- **Student Dashboard:** View GPAs, academic history, and performance trends.
- **Administrative Dashboard:** Manage student records, upload results, and monitor department-level metrics.
- **Authentication:** Secure user signup, login, and password reset functionalities.
- **Data Visualization:** Interactive charts (via Recharts) for GPA trend analysis.
- **Responsive Interface:** Modern and clean UI accessible on desktops and mobile devices.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (React framework with App Router)
- **Database:** [MongoDB](https://www.mongodb.com/) (using Mongoose ODM)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Data Visualization:** [Recharts](https://recharts.org/)

## Folder Structure

- `app/`: Next.js App Router pages and API routes (`api/auth`, `api/students`, `api/results`, etc.).
- `components/`: Reusable React components grouped by feature (`admin`, `home`, `layout`).
- `lib/`: Utility functions and database connection files (`dbConnect.js`, `mongodb.js`).
- `models/`: Mongoose schemas for MongoDB collections (`Student.js`, `Result.js`, `User.js`).

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16.x or newer)
- MongoDB instance (Atlas or local)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd RMS
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Set up the environment variables:
   Create a `.env.local` file in the root directory and add the necessary variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

- `npm run dev` - Runs the app in development mode.
- `npm run build` - Builds the app for production.
- `npm run start` - Runs the compiled production server.
- `npm run lint` - Runs the Next.js linter.
