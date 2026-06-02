# Bill Book Backend API

A Node.js/Express backend server for the Bill Book application. Manages bills and company information with MongoDB database.

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory with:
```
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret
```

### 3. Start the Server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server will run on `http://localhost:5000`

## 📁 Project Structure
```
backend/
├── config/          # Configuration files
├── controllers/     # Business logic
├── middleware/      # Custom middleware
├── models/         # Mongoose schemas
├── routes/         # API endpoints
├── utils/          # Utility functions
├── server.js       # Main server file
├── .env            # Environment variables
└── package.json
```

## 📚 API Endpoints

### Bills
- `POST /api/bills/create` - Create a new bill
- `GET /api/bills` - Get all bills
- `GET /api/bills/:id` - Get single bill by ID
- `PUT /api/bills/:id` - Update bill
- `DELETE /api/bills/:id` - Delete bill

### Company
- `POST /api/company` - Save/update company info
- `GET /api/company` - Get company info

## 🔧 Technologies Used
- Express.js - Web framework
- MongoDB - Database
- Mongoose - ODM
- CORS - Cross-origin requests
- bcryptjs - Password hashing
- jsonwebtoken - JWT authentication
- dotenv - Environment variables

## 📝 Request Examples

### Create Bill
```json
POST /api/bills/create
{
  "customerName": "John Doe",
  "mobile": "9876543210",
  "totalAmount": 5000,
  "items": [
    {
      "name": "Product A",
      "qty": 2,
      "rate": 1000,
      "amount": 2000
    }
  ]
}
```

### Save Company
```json
POST /api/company
{
  "companyName": "Shivani Fabrication",
  "ownerName": "Shivani",
  "mobile": "9876543210",
  "address": "123 Main St",
  "gstNumber": "18AABCD1234E5Z0"
}
```

## ✅ Validation
- Bill creation requires: `customerName`, `totalAmount` > 0
- Company requires: `companyName`

## 🛠️ Development Tools
- nodemon - Auto-restart on code changes
- ESLint ready (add eslint config if needed)

## 📧 Support
For issues or questions, contact the development team.
