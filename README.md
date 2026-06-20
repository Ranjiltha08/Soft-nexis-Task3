# TaskFlow API

> RESTful backend service for task management — Node.js + Express

---

## Quick Start

```bash
# Install dependencies
npm install

# Copy env file
cp .env.example .env

# Run in development (auto-restarts on change)
npm run dev

# Run in production
npm start
```

Server starts at **http://localhost:5000**

---

## API Endpoints

Base URL: `http://localhost:5000/api/tasks`  
Versioned: `http://localhost:5000/api/v1/tasks`

| Method | Endpoint         | Description            | Status Codes           |
|--------|-----------------|------------------------|------------------------|
| GET    | `/api/tasks`    | Get all tasks          | 200, 500               |
| GET    | `/api/tasks/:id`| Get single task        | 200, 404               |
| POST   | `/api/tasks`    | Create new task        | 201, 400               |
| PUT    | `/api/tasks/:id`| Update existing task   | 200, 400, 404          |
| DELETE | `/api/tasks/:id`| Delete task            | 204, 404               |
| DELETE | `/api/tasks`    | Clear completed tasks  | 200                    |
| GET    | `/health`       | Health check           | 200                    |

---

## Request & Response Examples

### Create a task
```http
POST /api/tasks
Content-Type: application/json

{ "text": "Learn Express" }
```
```json
{
  "id": 1,
  "text": "Learn Express",
  "completed": false,
  "createdAt": "2024-01-01T10:00:00.000Z",
  "updatedAt": "2024-01-01T10:00:00.000Z"
}
```

### Update a task
```http
PUT /api/tasks/1
Content-Type: application/json

{ "completed": true }
```

### Query parameters (GET /api/tasks)
| Param       | Type    | Example                       |
|-------------|---------|-------------------------------|
| `completed` | boolean | `?completed=true`             |
| `search`    | string  | `?search=express`             |

---

## Error Responses

All errors follow this shape:
```json
{
  "error": "Human-readable message",
  "details": [{ "field": "text", "message": "..." }]
}
```

---

## File Structure

```
taskflow-api/
├── server.js                    # Entry point
├── package.json
├── .env.example
├── src/
│   ├── routes/
│   │   └── taskRoutes.js        # Endpoint definitions
│   ├── controllers/
│   │   └── taskController.js    # Business logic / CRUD
│   ├── middleware/
│   │   ├── security.js          # Security headers
│   │   ├── errorHandler.js      # 404 + global error handler
│   │   └── requestLogger.js     # Coloured request logging
│   └── utils/
│       └── validation.js        # Zod schemas
└── tests/
    └── TaskFlow.postman_collection.json
```

---

## Testing with Postman

1. Open Postman → **Import** → select `tests/TaskFlow.postman_collection.json`
2. Make sure the server is running (`npm run dev`)
3. Click **Run Collection** to execute all tests in order

---

## Security Features

- **Helmet.js** — sets secure HTTP headers
- **CORS** — configured for cross-origin requests
- **Rate limiting** — 100 req / 15 min per IP
- **Zod validation** — strict input validation on all write endpoints
- **XSS safe** — input trimmed and validated before storage
