# FCA Refugee Support Program

A two-component web system for beneficiary registration.

# FCA Refugee Support Program

A two-component web system for beneficiary registration.

## Project Structure

```
fca-project/
├── frontend/
│   ├── index.html              # Landing page (self-contained)
│   ├── form.html               # Registration form (self-contained)
│   ├── assets/fca-logo.jpg
│   ├── css/
│   │   ├── landing.css
│   │   └── form.css
│   └── js/
│       ├── validation.js       # Pure validation logic (no DOM)
│       └── form.js             # DOM interactions & API calls
│
└── backend/
    ├── server.js               # Express entry point
    ├── package.json
    ├── .eslintrc.js            # ESLint config
    ├── .eslintignore
    ├── .prettierrc             # Prettier config
    ├── .prettierignore
    ├── .husky/
    │   └── pre-commit          # Git hook: runs lint-staged before commit
    ├── db/
    │   └── database.js         # SQLite setup
    ├── models/
    │   └── Beneficiary.js      # Data-access layer
    └── routes/
        └── beneficiaries.js    # REST endpoints + server-side validation
```

---

## Getting Started

### 1. Install & start the backend

```bash
cd backend
npm install
npm run prepare    
npm start         
npm run dev        
```

The API runs at `http://localhost:3000`.

### 2. Open the frontend

Just open `frontend/index.html` — double-click it or use Live Server in VS Code.
Both HTML files are self-contained (CSS and logo embedded), so no server is needed for the frontend.

---

## Code Quality Tools

### ESLint — catches bugs and enforces best practices

```bash
npm run lint        
npm run lint:fix    
```

Config: `.eslintrc.js`

### Prettier — enforces consistent formatting

```bash
npm run format        
npm run format:check  
```

Config: `.prettierrc`

### Husky + lint-staged — blocks bad commits

After `npm run prepare`, Husky activates a pre-commit hook.
Every time you run `git commit`, it automatically:
1. Runs ESLint on staged `.js` files (auto-fixes what it can)
2. Runs Prettier on staged `.js` files
3. Blocks the commit if any errors remain unfixed

Config: `lint-staged` in `package.json`

---

## API Endpoints

| Method | Path                      | Description             |
|--------|---------------------------|-------------------------|
| GET    | /api/health               | Server health check     |
| POST   | /api/beneficiaries        | Register a beneficiary  |
| GET    | /api/beneficiaries        | List all beneficiaries  |
| GET    | /api/beneficiaries/:id    | Get one beneficiary     |

### POST /api/beneficiaries — Request Body

```json
{
  "firstName":      "Jane",
  "lastName":       "Doe",
  "dob":            "1990/06/15",
  "placeOfBirth":   "Kampala",
  "gender":         "female",
  "nationality":    "Ugandan",
  "maritalStatus":  "Single",
  "settlementCamp": "Gulu settlement camp",
  "joinDate":       "2026/08/01"
}
```

### Success Response (201)
```json
{ "success": true, "message": "Beneficiary registered successfully", "data": { ... } }
```

### Validation Error Response (422)
```json
{ "success": false, "errors": { "firstName": "This field is required" } }
```

---

## Validation Rules

| Field                          | Rule                                          |
|--------------------------------|-----------------------------------------------|
| First name, Last name, Place of birth | Required; minimum 2 characters        |
| Date of birth                  | Required; must be before today                |
| Gender                         | Radio (Male / Female); Female by default      |
| Nationality                    | Required; one of 7 allowed values             |
| Marital status                 | Required; one of 5 allowed values             |
| Settlement camp                | Required; one of 7 allowed values             |
| Date of joining settlement camp | Required; must be after today               |