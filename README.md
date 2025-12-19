# 🍳 Ma Cuisine - AI Recipe Generator

A web application for generating personalized recipes based on available ingredients, powered by Gemini AI.

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Technologies](#-technologies)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Database Setup](#️-database-setup)
- [Launch](#-launch)
- [Project Structure](#-project-structure)
- [Usage](#-usage)
- [API Endpoints](#-api-endpoints)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Overview

**Ma Cuisine** is a web application that allows you to:
- Visually select ingredients from a database (OpenFoodFacts)
- Automatically generate personalized recipes with **Gemini AI**
- Save your favorite recipes with ratings and comments
- Browse your recipe history

---

## ✨ Features

### 🥗 Ingredient Selection
- Visual interface with ingredient images
- Automatic search via OpenFoodFacts API
- Smart filtering of processed products
- Multiple selection (up to 90 ingredients)

### 🤖 AI Recipe Generation
- Real-time generation with **Google Gemini AI**
- Customization based on number of servings
- Maximum cooking time parameter
- Dietary restrictions and preferences support

### 💾 Recipe Management
- Save to MySQL database
- Rating system (0-10)
- Complete history of all your creations
- Recipe deletion

---

## 🛠️ Technologies

### Backend
- **Node.js** v18+ (with native `fetch` support)
- **Express.js** - Web framework
- **MySQL** - Relational database
- **Gemini AI** - Recipe generation
- **OpenFoodFacts API** - Ingredient data

### Frontend
- HTML5 / CSS3 / Vanilla JavaScript
- LocalStorage for client-side persistence
- Fetch API for backend calls

---

## 📦 Prerequisites

Before starting, make sure you have installed:

### 1. Node.js and npm
- **Recommended version**: Node.js 18.x or higher
- Check installation:
  ```bash
  node --version
  npm --version
  ```
- Download: [https://nodejs.org/](https://nodejs.org/)

### 2. MySQL
- **Recommended version**: MySQL 8.0 or higher

#### Installation by OS:

**Windows:**
- Download [MySQL Installer](https://dev.mysql.com/downloads/installer/)
- Default port: `3306`

**macOS:**
- With Homebrew: `brew install mysql`
- Or download [MAMP](https://www.mamp.info/)
- MAMP port: `8889` (or `3306` depending on config)

**Linux:**
```bash
sudo apt update
sudo apt install mysql-server
```

### 3. Gemini API Key
- Create an account on [Google AI Studio](https://makersuite.google.com/app/apikey)
- Generate a free API key

---

## 🚀 Installation

### Step 1: Clone or download the project

```bash
# Clone the repository (if using Git)
git clone https://github.com/your-username/ma-cuisine.git
cd ma-cuisine

# OR extract the ZIP archive into a folder
```

### Step 2: Install Node.js dependencies

```bash
npm install
```

This command installs all necessary packages:
- `express` - Web framework
- `cors` - CORS management
- `mysql2` - MySQL driver
- `@google/generative-ai` - Gemini SDK
- `dotenv` - Environment variables
- `node-fetch` - HTTP requests (if Node < 18)

### Step 3: Create the MySQL database

#### A. Connect to MySQL

**Windows / Linux:**
```bash
mysql -u root -p
```

**macOS (MAMP):**
```bash
/Applications/MAMP/Library/bin/mysql -u root -p
```

#### B. Create the database

```sql
CREATE DATABASE ma_cuisine CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

---

## ⚙️ Configuration

### Create the `.env` file

At the **root of the project**, create a `.env` file with the following content:

```env
# Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# MySQL Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ma_cuisine

# Node.js server port
PORT=3000
```

#### ⚠️ OS-specific configuration

**Windows / Linux (native MySQL):**
```env
DB_HOST=localhost
DB_PORT=3306
```

**macOS (MAMP):**
```env
DB_HOST=localhost
DB_PORT=8889
```

**If you're using a different MySQL port, modify `DB_PORT` accordingly.**

---

## 🗄️ Database Setup

Once MySQL and the `.env` file are configured, run the table creation script:

```bash
node scripts/createTables.js
```

**Expected output:**
```
🔄 Suppression des anciennes tables...
✅ Anciennes tables supprimées
📝 Création des nouvelles tables...
✅ Table Users créée
✅ Table Ingredient créée
✅ Table Recipe créée
✅ Table Contain créée
🎉 Toutes les tables ont été créées avec succès !
```

### Created table structure

**Users**: Application users
- `id` (INT, PRIMARY KEY)
- `username` (VARCHAR 30, UNIQUE)
- `password` (VARCHAR 255)
- `created_at` (TIMESTAMP)

**Ingredient**: List of ingredients
- `id` (INT, PRIMARY KEY)
- `name` (VARCHAR 100, UNIQUE)
- `created_at` (TIMESTAMP)

**Recipe**: Generated recipes
- `id` (INT, PRIMARY KEY)
- `name` (VARCHAR 200)
- `description` (TEXT)
- `grade` (TINYINT 0-10)
- `people` (TINYINT)
- `max_cook_time` (SMALLINT)
- `notes` (TEXT)
- `id_u` (INT, FOREIGN KEY → Users)
- `created_at` (TIMESTAMP)

**Contain**: Many-to-Many relationship (Recipes ↔ Ingredients)
- `id` (INT, PRIMARY KEY)
- `id_r` (INT, FOREIGN KEY → Recipe)
- `id_i` (INT, FOREIGN KEY → Ingredient)
- `quantity` (VARCHAR 50)

---

## 🎬 Launch

### 1. Start the backend server

```bash
node index.js
```

**Expected output:**
```
🚀 Server launched on port 3000
✅ Connexion MySQL établie
📡 Routes disponibles:
  - POST   /api/recipes/generate
  - POST   /api/recipes/save
  - GET    /api/recipes/user/:userId
  - GET    /api/recipes/:recipeId
  - DELETE /api/recipes/:recipeId
  - GET    /api/ingredients?q=...
```

### 2. Open the application

#### Option A: With Live Server (recommended for development)

1. Install the **Live Server** extension in VS Code
2. Open the `public/` folder
3. Right-click on `landing/index.html` → **"Open with Live Server"**
4. The application opens at `http://127.0.0.1:5500/public/landing/index.html`

#### Option B: Manually

Open in a browser:
```
file:///path/to/your/project/public/landing/index.html
```

⚠️ **Note**: Some features may not work in `file://` due to CORS restrictions. Use Live Server or a local web server.

---

## 📁 Project Structure

```
ma-cuisine/
├── config/
│   └── database.js              # MySQL connection configuration
├── routes/
│   ├── auth.js                  # Authentication routes
│   ├── users.js                 # User routes
│   ├── ingredients.js           # Ingredient routes (OpenFoodFacts)
│   └── recipes.js              # Recipe routes (generation + CRUD)
├── services/
│   ├── openfoodfacts.js        # OpenFoodFacts API service
│   └── gemini.js               # Gemini API service
├── scripts/
│   └── createTables.js         # SQL table creation script
├── public/
│   ├── landing/
│   │   └── index.html          # Landing page
│   ├── login/
│   │   └── index.html          # Login page
│   ├── signup/
│   │   └── index.html          # Signup page
│   ├── ingredients/
│   │   └── index.html          # Ingredient selection
│   ├── recipe/
│   │   └── index.html          # Generated recipe display
│   ├── history/
│   │   └── index.html          # Recipe history
│   ├── script.js               # Frontend JavaScript
│   └── style.css               # CSS styles
├── .env                        # Environment variables (to create)
├── .gitignore
├── package.json
├── index.js                    # Express server entry point
└── README.md
```

---

## 📖 Usage

### Complete application flow

1. **Landing page** (`/landing/`)
   - Application presentation
   - "Get Started" and "Create Account" buttons

2. **Ingredient selection** (`/ingredients/`)
   - Automatic loading of ~90 ingredients from OpenFoodFacts
   - Click on ingredients to select them
   - Configuration: number of servings, max time, notes
   - Click "Generate my recipe"

3. **Recipe generation** (`/recipe/`)
   - Call to Gemini AI to generate the recipe
   - Display of formatted recipe
   - Ability to rate (0-10) and comment
   - Save to database

4. **History** (`/history/`)
   - List of all saved recipes
   - Display details (ingredients, rating, date)
   - Deletion available

---

## 🔌 API Endpoints

### Ingredients

**GET** `/api/ingredients?q={keyword}`
- Search for ingredients on OpenFoodFacts
- Parameter: `q` (search keyword)
- Returns: List of ingredients with images

```json
{
  "query": "tomato",
  "count": 24,
  "items": [
    {
      "name": "Tomato",
      "imageUrl": "https://..."
    }
  ]
}
```

### Recipes

**POST** `/api/recipes/generate`
- Generate a recipe with Gemini AI
- Body:
```json
{
  "ingredients": ["tomato", "onion", "garlic"],
  "people": 4,
  "maxCookTime": 30,
  "notes": "gluten-free"
}
```

**POST** `/api/recipes/save`
- Save a recipe to the database
- Body:
```json
{
  "userId": 1,
  "recipeName": "My recipe",
  "recipeDescription": "...",
  "ingredients": ["tomato", "onion"],
  "people": 4,
  "maxCookTime": 30,
  "notes": "gluten-free",
  "rating": 8
}
```

**GET** `/api/recipes/user/:userId`
- Get all recipes for a user

**GET** `/api/recipes/:recipeId`
- Get a specific recipe

**DELETE** `/api/recipes/:recipeId`
- Delete a recipe
- Body: `{ "userId": 1 }`

---

## 🐛 Troubleshooting

### Error: "Cannot add foreign key constraint"

**Cause**: Tables are not created in the correct order or types don't match.

**Solution**:
1. Drop all tables:
```sql
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS Contain, Recipe, Ingredient, Users;
SET FOREIGN_KEY_CHECKS = 1;
```
2. Re-run `node scripts/createTables.js`

---

### Error: "ECONNREFUSED" on port 3000

**Cause**: Backend server is not running.

**Solution**: Check that `node index.js` is running in a terminal.

---

### Error: "Access denied for user 'root'@'localhost'"

**Cause**: Incorrect MySQL password in `.env`.

**Solution**: Check `DB_PASSWORD` in the `.env` file

---

### Ingredients don't load

**Possible causes**:
1. Backend server is not running
2. The `/api/ingredients` route is incorrect
3. OpenFoodFacts API is temporarily unavailable

**Solution**:
1. Check that `node index.js` is running
2. Test manually: `http://localhost:3000/api/ingredients?q=tomato`
3. Check the browser console (F12) for errors

---

### Gemini error: "API key not valid"

**Cause**: Incorrect or missing Gemini API key.

**Solution**:
1. Check `GEMINI_API_KEY` in `.env`
2. Generate a new key on [Google AI Studio](https://makersuite.google.com/app/apikey)
3. Restart the server after modifying `.env`

---

### Recipe doesn't display after generation

**Possible causes**:
1. Gemini error (quota exceeded, invalid key)
2. Response parsing issue

**Solution**:
1. Check backend server logs
2. Test Gemini connection:
```javascript
// In Node.js console
const { testGeminiConnection } = require('./services/gemini');
testGeminiConnection();
```

---

### Port 3306 or 8889 already in use (MySQL)

**Cause**: Another MySQL instance is already running.

**Solution**:
- **Windows**: Stop MySQL service in Windows services
- **macOS**: Stop MAMP or the other MySQL server
- **Linux**: `sudo service mysql stop`

Or change the port in `.env`:
```env
DB_PORT=3307  # Use a free port
```

---

## 📝 Important Notes

### Security
⚠️ **This project is for educational purposes**. In production, you should:
- Hash passwords (bcrypt)
- Implement JWT for authentication
- Validate and sanitize all user inputs
- Use HTTPS
- Handle errors more securely

### Limitations
- Gemini AI quota: ~15 requests/minute (free tier)
- OpenFoodFacts: Data sometimes incomplete
- LocalStorage: Data lost if cache is cleared

### Possible Improvements
- [ ] Complete JWT authentication
- [ ] Image upload for recipes
- [ ] Recipe sharing between users
- [ ] Complementary ingredient suggestions
- [ ] PDF export of recipes
- [ ] Offline mode with Service Workers

---

## 👥 Authors

Project developed as part of a web development course.

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🆘 Support

If you encounter problems:
1. Check the [Troubleshooting](#-troubleshooting) section
2. Consult server logs (`node index.js`)
3. Check browser console (F12)
4. Verify all prerequisites are installed

---

**Bon appétit! 🍽️**
