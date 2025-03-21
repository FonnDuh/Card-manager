# Web Application - Business Content Management

## Project Description

This project is a web application that enables business users to publish and manage content through a dedicated management system. The published content will be available on the main website pages and will be managed via a user-friendly interface with options to add, edit, and delete content.

## Project Features

- **Main Website**: Displays content for regular users.
- **Authentication System**: Provides login and registration pages with form validation.
- **Content Management Interface**:
  - Add new content.
  - Edit existing content.
  - Delete content from the system.
- **Server-side Data Storage**: All data is managed and stored via a REST API.

## Functionality

1. **User Registration & Login**:

   - Displays login and registration pages with appropriate field labels.
   - Implements password validation using regex: Passwords must contain at least one uppercase and one lowercase English letter, at least four numbers, one special character (!@#$%^&_-\_()_), and must be at least 8 characters long.
   - Uses JWT to generate a secure token upon successful login.
   - Stores the token in `localStorage` while avoiding the storage of sensitive user data (such as email and password).
   - Determines user permissions based on the token information.
   - Provides visual indicators for user authentication status.

2. **User Dashboard**:

   - A dedicated page displaying all business cards created by the user.
   - Allows CRUD operations (Create, Read, Update, Delete) on business cards.

3. **New Business Card Page**:

   - Displays a relevant title and a form for creating a new business card.
   - Ensures that only business users can access this page.

4. **Edit Business Card Page**:

   - Displays a relevant title and a form pre-filled with the business card details retrieved from the database.

5. **Favorites System**:

   - Allows users to mark business cards as favorites.
   - Provides visual indicators for favorite cards.
   - Stores the favorite status in the database.
   - Includes a dedicated page listing all favorite business cards.
   - Allows users to remove a business card from favorites.

6. **CRM System (Admin Panel)**:

   - Provides a dedicated CRM page accessible only to admin users.
   - Displays a table of all users and their statuses.
   - Allows admins to update user roles (regular/business).
   - Enables admins to delete users, except for other admin accounts.

7. **Additional Features Added to the Official Requirements**:

   - **Dark Mode Support**: Implemented a dark mode toggle using a custom React hook (`useDarkMode.ts`).
   - **Loading Spinner**: A reusable `LoadingSpinner.tsx` component for better UX during API calls.
   - **Error Boundaries**: Implemented in `ErrorBoundary.tsx` to catch and display UI errors.
   - **Pagination**: Added a pagination component (`Pagination.tsx`) for business cards and CRM pages.
   - **Weather Widget**: Integrated a weather display component (`Weather.tsx`) to enhance user experience.
   - **Search Functionality**: Implemented with `fuse.js` for fuzzy searching within business cards and CRM.

8. **HTTP Requests**:
   - Uses `axios` to handle HTTP requests between the client and the server.
   - Implements error handling with `try & catch` for asynchronous requests or `.then().catch()` as an alternative.

## Technologies

- **Frontend**: React + TypeScript (using Vite as the main build tool)
- **Authentication**: JWT (JSON Web Tokens)
- **Libraries Used**:
  - `axios` for HTTP requests
  - `formik` for form handling
  - `yup` for validation
  - `jwt-decode` for authentication
  - `fuse.js` for search functionality
  - `react-toastify` for notifications
  - `react-bootstrap` for styling

## Setup Instructions

1. **Clone the repository**

   ```bash
   https://github.com/FonnDuh/Card-manager.git
   cd project-folder
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the client**

   ```bash
   npm run dev
   ```

4. **Access the application**
   - The main website will be available at `http://localhost:5173`
   - The management interface is accessible after login.
