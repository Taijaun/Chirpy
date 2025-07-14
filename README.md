# Chirpy 🐦

A simple Twitter-like backend service built with Node.js and Express, where users can create short messages called **chirps**. Users can register, log in with JWT-based authentication, post chirps, and manage their accounts via a RESTful API.

---

## 🔧 Features<br>

- User registration and authentication using **JSON Web Tokens (JWT)**<br>
- Create, read, update, and delete (CRUD) chirps<br>
- Each chirp is linked to its owner (authenticated user)<br>
- Secure routes with JWT middleware<br>
- Update user login details and reset password<br>
- RESTful API structure<br>
- PostgreSQL database integration<br>

---

## 🛠 Tech Stack<br>

- **Backend:** Node.js, Express.js<br>
- **Database:** PostgreSQL<br>
- **Authentication:** JSON Web Tokens (JWT)<br>
- **Environment Management:** dotenv<br>
- **Version Control:** Git & GitHub<br>

---

## 📂 Project Structure<br>

Chirpy/
├── handlers/<br>
├── middleware/<br>
├── db/<br>
├── utils/<br>
├── server.js<br>
├── package.json<br>
└── README.md<br>

---

## 📦 Installation<br>

1. **Clone the repo**
   ```bash
   git clone https://github.com/Taijaun/Chirpy.git
   cd Chirpy

2.	Install dependencies<br>

npm install<br>


3.	Set up environment variables<br>
	•	Rename .env.example to .env<br>
	•	Add your PostgreSQL connection string and JWT secret:<br>

DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
PORT=5000


4.	Start the development server<br>

npm run dev



⸻

📬 API Endpoints<br>

🔐 Auth Routes<br>

Method	Endpoint	Description<br>
POST	/register	Register a new user<br>
POST	/login	Log in and get JWT token<br>
PUT	/reset-password	Reset user password<br>
PUT	/update-login	Update login details<br>

💡 All protected routes require a JWT token sent in the Authorization header as Bearer <token>.<br>

⸻

🐦 Chirp Routes<br>

Method	Endpoint	Description<br>
GET	/chirps	View all chirps
POST	/chirps	Create a new chirp
GET	/chirps/:id	View a specific chirp
PUT	/chirps/:id	Update a chirp
DELETE	/chirps/:id	Delete a chirp

⸻

🔐 JWT Authentication<br>
	•	When a user logs in successfully, they receive a JWT token.<br>
	•	Include the token in all subsequent requests to protected routes:<br>

Authorization: Bearer your_token_here<br>


•	Tokens are verified with middleware to protect user data and actions.<br>

⸻

📌 To Do / Future Improvements<br>
	•	Add likes and replies to chirps<br>
	•	Pagination and sorting<br>
	•	User profile customization (e.g. bios, avatars)<br>
	•	Rate limiting or spam protection<br>
	•	Swagger/OpenAPI docs<br>
	•	Frontend integration (React)<br>

⸻

📄 License

MIT – feel free to use, learn from, or contribute to the project.

⸻

🙌 Contributions

Pull requests welcome! Feel free to open an issue or suggest a feature.

---
