# Virtual Banking Management System

This is a complete full-stack Virtual Banking project utilizing Spring Boot for the backend APIs and React with Vite for the frontend.

## Prerequisites
- **Java 17+**
- **Node.js (18+)**
- **MySQL (running on localhost:3306)**

## Setup Instructions

### 1. Database Setup
1. Create a MySQL database named `virtual_bank`.
2. The user is configured as `root` with the password `password`. Modify `backend/src/main/resources/application.properties` if your MySQL credentials differ.
3. You can find the database schema inside the `schema.sql` file in the root directory.

### 2. Run the Backend
1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Run the application using the Maven wrapper:
   ```bash
   ./mvnw spring-boot:run
   ```
   (On Windows, use `.\mvnw.cmd spring-boot:run`)
3. The server will start on `http://localhost:8080`.
The application uses Hibernate `ddl-auto=update` so the tables will be created automatically in MySQL.

### 3. Run the Frontend
1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Start the Vite React development server:
   ```bash
   npm run dev
   ```
3. Open your browser to `http://localhost:5173`.

---

## API Endpoints List

### Authentication
- `POST /api/auth/register` - Register a new user (`username`, `email`, `password`)
- `POST /api/auth/login` - Login (`username`, `password`)

### Accounts
- `GET /api/accounts/user/{userId}` - Get all accounts for a specific user ID
- `POST /api/accounts/deposit` - Deposit funds (`accountId`, `amount`)
- `POST /api/accounts/withdraw` - Withdraw funds (`accountId`, `amount`)
- `POST /api/accounts/transfer` - Transfer funds to an account number (`sourceAccountId`, `targetAccountNumber`, `amount`)
- `GET /api/accounts/{accountId}/transactions` - Get transaction history for an account

---

## Sample Data for Testing

You can use the frontend UI to create a user and initiate testing, but if you'd like to seed the database with an additional dummy user having a balance, you can run the following SQL queries directly in your MySQL client after starting the application for the first time:

```sql
USE virtual_bank;

-- Insert a test receiver
INSERT INTO users (username, password, email) VALUES ('alice', 'password123', 'alice@example.com');

-- Get Alice's automatically generated ID (assuming it is 1 for this example)
INSERT INTO accounts (account_number, balance, user_id) VALUES ('9999999999', 5000.00, 1);
```

Then, you can login via the UI, create your own account, and transfer money to `9999999999` (Alice's account number).
