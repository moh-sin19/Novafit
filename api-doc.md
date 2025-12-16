#AI ACKNOWLEDGMENT: AI WAS USED TO HELP CREATE THE API DOCUMENTATION

# API Documentation

This document describes the available backend REST API endpoints.

All endpoints are prefixed as follows:

- **User Service:** `/api/users`
- **Nutrition Service:** `/api/nutrition`

Each request other than `/register` and `/login` requires:
```bash
Authorization: Bearer <JWT_TOKEN>
X-User-Id: <numeric userId>
```

---
# User Service

## Authentication

- Authentication is **JWT-based**.  
- On successful login, a token is returned:
  ```json
  {
    "token": "<JWT_TOKEN>",
    "tokenType": "Bearer"
  }
  ```
- For authenticated requests, include the header:

  ```
  Authorization: Bearer <JWT_TOKEN>
  ```

---

## Endpoints

### 1. Register User
**POST** `/api/users/register`

**Request body:**
```json
{
  "email": "alice@example.com",
  "username": "alice123",
  "password": "password123",
  "firstName": "Alice",
  "lastName": "Doe",
  "dateOfBirth": "2000-01-01",
  "sex": "female",
  "heightCm": 165,
  "weightKg": 55,
  "activityLevel": "medium",
  "timezone": "Australia/Sydney",
  "unitWeight": "kg",
  "unitEnergy": "kcal",
  "locale": "en_AU"
}
```

**Response:**
```json
{
  "userId": 1,
  "email": "alice@example.com",
  "username": "alice123",
  "createdAt": "2025-09-20T08:40:34Z",
  "firstName": "Alice",
  "lastName": "Doe",
  "heightCm": 165,
  "weightKg": 55,
  "timezone": "Australia/Sydney",
  "unitWeight": "kg",
  "unitEnergy": "kcal",
  "locale": "en_AU"
}
```

---

### 2. Login
**POST** `/api/users/login`

**Request body:**
```json
{
  "usernameOrEmail": "alice@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "userId": 1,
  "email": "alice@example.com",
  "username": "alice123",
  "createdAt": "2025-09-20T08:40:34Z",
  "firstName": "Alice",
  "lastName": "Doe",
  "token": "<JWT_TOKEN>",
  "tokenType": "Bearer"
}
```

---

### 3. Get Current User
**GET** `/api/users/me`  
Headers: `Authorization: Bearer <JWT_TOKEN>`

**Response:**
```json
{
  "userId": 1,
  "email": "alice@example.com",
  "username": "alice123",
  "firstName": "Alice",
  "lastName": "Doe",
  "timezone": "Australia/Sydney",
  "unitWeight": "kg",
  "unitEnergy": "kcal"
}
```

---

### 4. Update User (Email/Username)
**PUT** `/api/users/me`  
Headers: `Authorization: Bearer <JWT_TOKEN>`

**Request body (any subset of these fields):**
```json
{
  "email": "newalice@example.com",
  "username": "alice_new"
}
```

---

### 5. Update Profile
**PUT** `/api/users/me/profile`  
Headers: `Authorization: Bearer <JWT_TOKEN>`

**Request body:**
```json
{
  "firstName": "Alice",
  "lastName": "Doe",
  "heightCm": 170,
  "weightKg": 58,
  "activityLevel": "high",
  "timezone": "Australia/Sydney",
  "unitWeight": "kg",
  "unitEnergy": "kcal",
  "locale": "en_AU"
}
```

---

### 6. Change Password
**PUT** `/api/users/me/change-password`  
Headers: `Authorization: Bearer <JWT_TOKEN>`

**Request body:**
```json
{
  "oldPassword": "password123",
  "newPassword": "password456",
  "confirmPassword": "password456"
}
```

**Response:**
```json
{
  "message": "Password changed successfully"
}
```

---

### 7. Delete Account
**DELETE** `/api/users/me`  
Headers: `Authorization: Bearer <JWT_TOKEN>`

**Response:**  
`204 No Content`

---

### 8. Logout
**POST** `/api/users/logout`

Since JWT is stateless, logout just means the frontend deletes the token.  
(Backend may implement token blacklisting later if needed.)

---

# Nutrition Service

## Endpoints

### 1. Get Meal Types
**GET** `/api/nutrition/meal-types`

Returns a list of valid meal categories.

**Response:**
```json
  ["BREAKFAST", "LUNCH", "DINNER", "SNACK"]
```

---

### 2. Search Foods
**GET** `/api/nutrition/search?q=<query>&page=<page>&page_size=<size>`

Searches both local and FatSecret food databases

**Example:**
```GET /api/nutrition/search?q=banana&page=0&page_size=10```

**Response:**
```json
  {
    "page": 0,
    "pageSize": 10,
    "total": 1999,
    "items": [
      {
        "id": 1,
        "externalId": null,
        "name": "Banana",
        "brand": "Generic",
        "foodType": "CUSTOM",
        "foodUrl": null,
        "description": "Generic"
      },
      {
        "id": null,
        "externalId": "35755",
        "name": "Bananas",
        "brand": null,
        "foodType": "Generic",
        "foodUrl": "https://foods.fatsecret.com/calories-nutrition/usda/bananas",
        "description": "Per 100g - Calories: 89kcal | Fat: 0.33g | Carbs: 22.84g | Protein: 1.09g"
      },
      {
        "id": null,
        "externalId": "5388",
        "name": "Banana",
        "brand": null,
        "foodType": "Generic",
        "foodUrl": "https://foods.fatsecret.com/calories-nutrition/generic/banana-raw",
        "description": "Per 100g - Calories: 89kcal | Fat: 0.33g | Carbs: 22.84g | Protein: 1.09g"
      },
      {
        "id": null,
        "externalId": "624623",
        "name": "Bananas",
        "brand": "Dole",
        "foodType": "Brand",
        "foodUrl": "https://foods.fatsecret.com/calories-nutrition/dole/bananas",
        "description": "Per 1 medium - Calories: 110kcal | Fat: 0.30g | Carbs: 29.00g | Protein: 1.00g"      
      },
      {
        "id": null,
        "externalId": "3864996",
        "name": "Banana",
        "brand": "Chiquita",
        "foodType": "Brand",
        "foodUrl": "https://foods.fatsecret.com/calories-nutrition/chiquita/banana",
        "description": "Per 1 medium banana - Calories: 108kcal | Fat: 0.60g | Carbs: 28.80g | Protein: 1.40g"
      },
      {
        "id": null,
        "externalId": "69416",
        "name": "Bananas (Large)",
        "brand": "Giant Food",
        "foodType": "Brand",
        "foodUrl": "https://foods.fatsecret.com/calories-nutrition/giant-food/bananas-(large)",
        "description": "Per 1 banana - Calories: 121kcal | Fat: 0.00g | Carbs: 31.00g | Protein: 1.00g"      
      },
      {
        "id": null,
        "externalId": "886932",
        "name": "Mini Banana",
        "brand": "Chiquita",
        "foodType": "Brand",
        "foodUrl": "https://foods.fatsecret.com/calories-nutrition/chiquita/mini-banana",
        "description": "Per 1 mini banana - Calories: 55kcal | Fat: 0.00g | Carbs: 14.50g | Protein: 0.50g"  
      },
      {
        "id": null,
        "externalId": "8871158",
        "name": "Baby Banana",
        "brand": "Dole",
        "foodType": "Brand",
        "foodUrl": "https://foods.fatsecret.com/calories-nutrition/dole/baby-banana",
        "description": "Per 1 baby banana - Calories: 72kcal | Fat: 0.00g | Carbs: 19.00g | Protein: 1.00g"  
      },
      {
        "id": null,
        "externalId": "547041",
        "name": "Organic Bananas",
        "brand": "Dole",
        "foodType": "Brand",
        "foodUrl": "https://foods.fatsecret.com/calories-nutrition/dole/organic-bananas",
        "description": "Per 1 medium - Calories: 110kcal | Fat: 0.00g | Carbs: 29.00g | Protein: 1.00g"      
      },
      {
        "id": null,
        "externalId": "103773217",
        "name": "Banana",
        "brand": "Panera Bread",
        "foodType": "Brand",
        "foodUrl": "https://foods.fatsecret.com/calories-nutrition/panera-bread/banana",
        "description": "Per 1 serving - Calories: 90kcal | Fat: 0.00g | Carbs: 23.00g | Protein: 1.00g"
      },
      {
        "id": null,
        "externalId": "1823250",
        "name": "Banana",
        "brand": "Del Monte",
        "foodType": "Brand",
        "foodUrl": "https://foods.fatsecret.com/calories-nutrition/del-monte/banana",
        "description": "Per 1 medium - Calories: 110kcal | Fat: 0.00g | Carbs: 29.00g | Protein: 1.00g"      
      }
    ]
  }

```

### 3. Get Food Detail (Local)
**GET** `/api/nutrition/foods/{foodId}`

Fetches a food record from the local database with its serving options.

**Response Example:**
```json
{
  "foodId": 4,
  "source": "CUSTOM",
  "name": "Greek Yogurt, plain",
  "brand": "Generic",
  "servings": [
    {
      "servingId": 4,
      "label": "1 cup",
      "units": 1.0,
      "metricQty": null,
      "metricUnit": null,
      "kcal": 150.0,
      "proteinG": 23.0,
      "carbsG": 9.0,
      "fatG": 4.0
    }
  ]
}

```

### 4. Get External Food (Raw FatSecret)
**GET** `/api/nutrition/foods/external/{externalId}/raw`

Fetches the raw FatSecret payload for an external food.

**Request Example:**
` GET /api/nutrition/foods/external/44911664/raw`

**Response Example:**
```json
{
  "food": {
    "brand_name": "Cosmic Crisp",
    "food_id": "44911664",
    "food_name": "Apple",
    "food_type": "Brand",
    "servings": {
      "serving": {
        "serving_id": "38715860",
        "serving_description": "1 apple",
        "metric_serving_amount": "140.000",
        "metric_serving_unit": "g",
        "calories": "100",
        "carbohydrate": "24.00",
        "fat": "0.50",
        "protein": "0"
      }
    }
  }
}

```

### 5. Create Food Log
**POST** `/api/nutrition/food-logs`

Creates a new log entry.
**Request (Local food)**
```json
{
  "foodId": 4,
  "servingId": 1,
  "servingType": "1 cup",
  "servingQty": 1,
  "mealType": "BREAKFAST",
  "logDate": "2025-10-22",
  "note": "Morning yogurt"
}
```

**Request (External food)**
```json
{
  "externalId": "44911664",
  "servingId": "38715860",
  "servingType": "1 apple",
  "servingQty": 1,
  "mealType": "SNACK",
  "logDate": "2025-10-22",
  "note": "Afternoon snack"
}
```

**Response Example**
```json
{
  "logId": 2,
  "foodId": 4,
  "status": "created"
}
```

### 6. Update Food Log
**PATCH**  `/api/nutrition/food-logs/{id}`

Updates a food log (e.g., serving or quantity).

**Request Example**

```json
{
  "servingQty": 1.5,
  "servingId": 2
}
```
**Response**
`204 No Content`

### 7. Get Logs for a day
**GET** `/api/nutrition/food-logs?date=YYYY-MM-DD`

**Response**
```json
[
  {
    "logId": 2,
    "mealType": "BREAKFAST",
    "servingQty": 1.0,
    "servingType": "1 cup",
    "kcalSnapshot": 150.0,
    "proteinGSnapshot": 23.0,
    "carbsGSnapshot": 9.0,
    "carbsGSnapshot": 28.0,
    "fatGSnapshot": 0.4,
    "foodId": 1,
    "name": "Banana",
    "brand": "Generic",
    "logDate": "2025-10-22"
  }
]
```

### 8. Get Daily Summary
**GET** `/api/nutrition/summary/day?date=YYYY-MM-DD`

**Response**
```json
{
  "kcal": 2150,
  "protein_g": 120.5,
  "carbs_g": 210.3,
  "fat_g": 70.2
}
```

### 9. Get Range Summary

**GET** `/api/nutrition/summary/range?start=YYYY-MM-DD&end=YYYY-MM-DD`

**Response:**
```json
[
  { "date": "2025-10-20", "kcal": 2100, "protein_g": 110, "carbs_g": 230, "fat_g": 60 },
  { "date": "2025-10-21", "kcal": 2200, "protein_g": 120, "carbs_g": 240, "fat_g": 65 }
]
```

### 10. Favourites
#### Add Favourite

**POST** `/api/nutrition/favourites/{foodId}`
**Response:** 204 No Content

#### Remove Favourite

**DELETE** `/api/nutrition/favourites/{foodId}`
**Response:** `204 No Content`

#### List Favourites

**GET** `/api/nutrition/favourites`

**Response:**
```json
[
  {
    "foodId": 4,
    "name": "Greek Yogurt, plain",
    "brand": "Generic",
    "servingUnit": "1 cup",
    "kcal": 150
  },
  {
    "foodId": 1,
    "name": "Banana",
    "brand": "Generic",
    "servingUnit": "100 g",
    "kcal": 89
  }
]
```

# Goal API Documentation

## Base URL
```
/api/goals
```

## Overview
The Goal API provides endpoints for managing user goals and tracking progress. Goals allow users to set targets for various fitness metrics like weight, BMI, workout frequency, and calorie intake. The API supports creating, updating, deleting goals, and tracking progress with detailed calculations including percentage completion, days remaining, and on-track status.

---

## Endpoints

### 1. Create Goal
**POST** `/api/goals`

Creates a new goal for the authenticated user.

#### Request Body
```json
{
  "type": "WEIGHT_KG",
  "frequency": "weekly",
  "targetValue": 70.0,
  "startDate": "2024-01-15",
  "endDate": "2024-03-15",
  "description": "Lose weight to reach target weight",
  "notes": "Focus on cardio and healthy eating"
}
```

#### Request Schema
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | enum | ✅ | Goal type: `"WEIGHT_KG"`, `"BMI"`, `"WORKOUTS_PER_WEEK"`, `"CALORIES_KCAL"` |
| `frequency` | enum | ✅ | Goal frequency: `"daily"`, `"weekly"`, `"custom_range"` |
| `targetValue` | number | ✅ | Target value (must be positive) |
| `startDate` | string (date) | ✅ | Goal start date (YYYY-MM-DD format, today or future) |
| `endDate` | string (date) | ❌ | Goal end date (YYYY-MM-DD format, must be in future) |
| `description` | string | ❌ | Goal description (max 500 characters) |
| `notes` | string | ❌ | Additional notes (max 1000 characters) |

#### Response
```json
{
  "goalId": 1,
  "userId": 1,
  "type": "WEIGHT_KG",
  "frequency": "weekly",
  "targetValue": 70.0,
  "startDate": "2024-01-15",
  "endDate": "2024-03-15",
  "status": "active",
  "achieved": false,
  "lastUpdated": "2024-01-15T10:30:00Z",
  "description": null,
  "notes": null
}
```

#### Status Codes
- `200 OK` - Goal created successfully
- `400 Bad Request` - Validation error
- `401 Unauthorized` - User not authenticated

---

### 2. Get User Goals
**GET** `/api/goals?userId={userId}`

Retrieves all goals for a specific user.

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | integer | ✅ | ID of the user |

#### Response
```json
[
  {
    "goalId": 1,
    "userId": 1,
    "type": "WEIGHT_KG",
    "frequency": "weekly",
    "targetValue": 70.0,
    "startDate": "2024-01-15",
    "endDate": "2024-03-15",
    "status": "active",
    "achieved": false,
    "lastUpdated": "2024-01-15T10:30:00Z",
    "description": null,
    "notes": null
  },
  {
    "goalId": 2,
    "userId": 1,
    "type": "CALORIES_KCAL",
    "frequency": "daily",
    "targetValue": 2000.0,
    "startDate": "2024-01-10",
    "endDate": "2024-02-10",
    "status": "paused",
    "achieved": false,
    "lastUpdated": "2024-01-12T14:20:00Z",
    "description": null,
    "notes": null
  }
]
```

#### Status Codes
- `200 OK` - Goals retrieved successfully
- `404 Not Found` - User not found

---

### 3. Get Active User Goals
**GET** `/api/goals/active?userId={userId}`

Retrieves only active goals for a specific user.

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | integer | ✅ | ID of the user |

#### Response
```json
[
  {
    "goalId": 1,
    "userId": 1,
    "type": "WEIGHT_KG",
    "frequency": "weekly",
    "targetValue": 70.0,
    "startDate": "2024-01-15",
    "endDate": "2024-03-15",
    "status": "active",
    "achieved": false,
    "lastUpdated": "2024-01-15T10:30:00Z",
    "description": null,
    "notes": null
  }
]
```

#### Status Codes
- `200 OK` - Active goals retrieved successfully
- `404 Not Found` - User not found

---

### 4. Get User Goals by Type
**GET** `/api/goals/type?userId={userId}&type={type}`

Retrieves goals for a specific user filtered by goal type.

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | integer | ✅ | ID of the user |
| `type` | enum | ✅ | Goal type: `"WEIGHT_KG"`, `"BMI"`, `"WORKOUTS_PER_WEEK"`, `"CALORIES_KCAL"` |

#### Response
```json
[
  {
    "goalId": 1,
    "userId": 1,
    "type": "WEIGHT_KG",
    "frequency": "weekly",
    "targetValue": 70.0,
    "startDate": "2024-01-15",
    "endDate": "2024-03-15",
    "status": "active",
    "achieved": false,
    "lastUpdated": "2024-01-15T10:30:00Z",
    "description": null,
    "notes": null
  }
]
```

#### Status Codes
- `200 OK` - Goals retrieved successfully
- `404 Not Found` - User not found

---

### 5. Update Goal
**PUT** `/api/goals/{goalId}`

Updates an existing goal. All fields are optional for partial updates.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `goalId` | integer | ✅ | ID of the goal to update |

#### Request Body
```json
{
  "type": "WEIGHT_KG",
  "frequency": "weekly",
  "targetValue": 68.0,
  "startDate": "2024-01-15",
  "endDate": "2024-04-15",
  "status": "active",
  "description": "Updated weight goal",
  "notes": "Extended timeline"
}
```

#### Request Schema
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | enum | ❌ | Goal type: `"WEIGHT_KG"`, `"BMI"`, `"WORKOUTS_PER_WEEK"`, `"CALORIES_KCAL"` |
| `frequency` | enum | ❌ | Goal frequency: `"daily"`, `"weekly"`, `"custom_range"` |
| `targetValue` | number | ❌ | Target value (must be positive) |
| `startDate` | string (date) | ❌ | Goal start date (YYYY-MM-DD format) |
| `endDate` | string (date) | ❌ | Goal end date (YYYY-MM-DD format, must be in future) |
| `status` | enum | ❌ | Goal status: `"active"`, `"paused"`, `"done"` |
| `description` | string | ❌ | Goal description (max 500 characters) |
| `notes` | string | ❌ | Additional notes (max 1000 characters) |

#### Response
Returns the updated goal in the same format as the create goal response.

#### Status Codes
- `200 OK` - Goal updated successfully
- `400 Bad Request` - Validation error
- `404 Not Found` - Goal not found

---

### 6. Delete Goal
**DELETE** `/api/goals/{goalId}`

Deletes a goal permanently.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `goalId` | integer | ✅ | ID of the goal to delete |

#### Response
No content body.

#### Status Codes
- `204 No Content` - Goal deleted successfully
- `404 Not Found` - Goal not found

---

### 7. Get Goal Progress
**GET** `/api/goals/{goalId}/progress`

Retrieves detailed progress information for a specific goal.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `goalId` | integer | ✅ | ID of the goal |

#### Response
```json
{
  "goalId": 1,
  "userId": 1,
  "type": "WEIGHT_KG",
  "frequency": "weekly",
  "targetValue": 70.0,
  "startDate": "2024-01-15",
  "endDate": "2024-03-15",
  "status": "active",
  "achieved": false,
  "lastUpdated": "2024-01-15T10:30:00Z",
  "description": null,
  "notes": null,
  "currentValue": 75.0,
  "progressPercentage": 107.14,
  "daysRemaining": 59,
  "daysElapsed": 14,
  "averageDailyProgress": 0.36,
  "requiredDailyProgress": -0.17,
  "onTrack": true,
  "progressStatus": "on_track",
  "recentProgress": []
}
```

#### Progress Fields
| Field | Type | Description |
|-------|------|-------------|
| `currentValue` | number | Current progress value |
| `progressPercentage` | number | Percentage completion (0-100) |
| `daysRemaining` | integer | Days until end date (null if no end date) |
| `daysElapsed` | integer | Days since start date |
| `averageDailyProgress` | number | Average progress per day |
| `requiredDailyProgress` | number | Required daily progress to meet goal |
| `onTrack` | boolean | Whether currently on track to meet goal |
| `progressStatus` | string | Status: `"on_track"`, `"behind"`, `"ahead"`, `"completed"` |
| `recentProgress` | array | Recent progress history (currently empty) |

#### Status Codes
- `200 OK` - Progress retrieved successfully
- `404 Not Found` - Goal not found

---

### 8. Get User Goal Progress
**GET** `/api/goals/user/{userId}/progress`

Retrieves detailed progress information for all goals of a specific user.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | integer | ✅ | ID of the user |

#### Response
```json
[
  {
    "goalId": 1,
    "userId": 1,
    "type": "WEIGHT_KG",
    "frequency": "weekly",
    "targetValue": 70.0,
    "startDate": "2024-01-15",
    "endDate": "2024-03-15",
    "status": "active",
    "achieved": false,
    "lastUpdated": "2024-01-15T10:30:00Z",
    "description": null,
    "notes": null,
    "currentValue": 75.0,
    "progressPercentage": 107.14,
    "daysRemaining": 59,
    "daysElapsed": 14,
    "averageDailyProgress": 0.36,
    "requiredDailyProgress": -0.17,
    "onTrack": true,
    "progressStatus": "on_track",
    "recentProgress": []
  },
  {
    "goalId": 2,
    "userId": 1,
    "type": "CALORIES_KCAL",
    "frequency": "daily",
    "targetValue": 2000.0,
    "startDate": "2024-01-10",
    "endDate": "2024-02-10",
    "status": "paused",
    "achieved": false,
    "lastUpdated": "2024-01-12T14:20:00Z",
    "description": null,
    "notes": null,
    "currentValue": 1850.0,
    "progressPercentage": 92.5,
    "daysRemaining": 15,
    "daysElapsed": 25,
    "averageDailyProgress": 74.0,
    "requiredDailyProgress": 10.0,
    "onTrack": true,
    "progressStatus": "on_track",
    "recentProgress": []
  }
]
```

#### Status Codes
- `200 OK` - Progress retrieved successfully
- `404 Not Found` - User not found

---

### 9. Complete Goal
**POST** `/api/goals/{goalId}/complete`

Marks a goal as completed (sets status to "done" and achieved to true).

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `goalId` | integer | ✅ | ID of the goal to complete |

#### Response
No content body.

#### Status Codes
- `204 No Content` - Goal completed successfully
- `404 Not Found` - Goal not found

---

## Data Types

### GoalType Enum
- `"WEIGHT_KG"` - Weight goals in kilograms
- `"BMI"` - Body Mass Index goals
- `"WORKOUTS_PER_WEEK"` - Number of workouts per week
- `"CALORIES_KCAL"` - Daily calorie intake goals

### GoalFrequency Enum
- `"daily"` - Daily goals
- `"weekly"` - Weekly goals
- `"custom_range"` - Goals with custom date range

### GoalStatus Enum
- `"active"` - Goal is currently active
- `"paused"` - Goal is temporarily paused
- `"done"` - Goal is completed

### Date Format
- **Date**: ISO 8601 date format: `"2024-01-15"`
- **Timestamp**: ISO 8601 timestamp format: `"2024-01-15T10:30:00Z"`

---

## Error Handling

### Common Error Response Format
```json
{
  "error": "Error message",
  "status": 400,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Common Status Codes
- `200 OK` - Request successful
- `204 No Content` - Request successful, no content returned
- `400 Bad Request` - Validation error or malformed request
- `401 Unauthorized` - User not authenticated
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Usage Examples

### Frontend Integration Examples

#### JavaScript/TypeScript
```typescript
// Create a goal
const createGoal = async (goalData: CreateGoalRequest) => {
  const response = await fetch('/api/goals', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(goalData)
  });
  return response.json();
};

// Get user goals
const getUserGoals = async (userId: number) => {
  const response = await fetch(`/api/goals?userId=${userId}`);
  return response.json();
};

// Get active goals only
const getActiveGoals = async (userId: number) => {
  const response = await fetch(`/api/goals/active?userId=${userId}`);
  return response.json();
};

// Get goals by type
const getGoalsByType = async (userId: number, type: GoalType) => {
  const response = await fetch(`/api/goals/type?userId=${userId}&type=${type}`);
  return response.json();
};

// Update goal
const updateGoal = async (goalId: number, updateData: UpdateGoalRequest) => {
  const response = await fetch(`/api/goals/${goalId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(updateData)
  });
  return response.json();
};

// Get goal progress
const getGoalProgress = async (goalId: number) => {
  const response = await fetch(`/api/goals/${goalId}/progress`);
  return response.json();
};

// Get all user goal progress
const getUserGoalProgress = async (userId: number) => {
  const response = await fetch(`/api/goals/user/${userId}/progress`);
  return response.json();
};

// Complete goal
const completeGoal = async (goalId: number) => {
  const response = await fetch(`/api/goals/${goalId}/complete`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.status === 204;
};

// Delete goal
const deleteGoal = async (goalId: number) => {
  const response = await fetch(`/api/goals/${goalId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.status === 204;
};
```

#### React Hook Examples
```typescript
// Hook for managing user goals
const useUserGoals = (userId: number) => {
  const [goals, setGoals] = useState<GoalResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const data = await getUserGoals(userId);
        setGoals(data);
      } catch (error) {
        console.error('Failed to fetch goals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, [userId]);

  return { goals, loading };
};

// Hook for goal progress
const useGoalProgress = (goalId: number) => {
  const [progress, setProgress] = useState<GoalProgressResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await getGoalProgress(goalId);
        setProgress(data);
      } catch (error) {
        console.error('Failed to fetch goal progress:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [goalId]);

  return { progress, loading };
};

// Hook for all user goal progress
const useUserGoalProgress = (userId: number) => {
  const [progress, setProgress] = useState<GoalProgressResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await getUserGoalProgress(userId);
        setProgress(data);
      } catch (error) {
        console.error('Failed to fetch user goal progress:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [userId]);

  return { progress, loading };
};
```

#### Complete Goal Management Flow
```typescript
// Complete workflow for goal management
const manageGoals = async (userId: number) => {
  // 1. Create a weight loss goal
  const weightGoal = await createGoal({
    type: "WEIGHT_KG",
    frequency: "weekly",
    targetValue: 70.0,
    startDate: "2024-01-15",
    endDate: "2024-03-15",
    description: "Lose weight to reach target",
    notes: "Focus on cardio and healthy eating"
  });

  // 2. Create a calorie goal
  const calorieGoal = await createGoal({
    type: "CALORIES_KCAL",
    frequency: "daily",
    targetValue: 2000.0,
    startDate: "2024-01-15",
    endDate: "2024-02-15",
    description: "Maintain daily calorie intake",
    notes: "Track all meals"
  });

  // 3. Get all goals for the user
  const allGoals = await getUserGoals(userId);
  console.log('All goals:', allGoals);

  // 4. Get only active goals
  const activeGoals = await getActiveGoals(userId);
  console.log('Active goals:', activeGoals);

  // 5. Get weight goals only
  const weightGoals = await getGoalsByType(userId, "WEIGHT_KG");
  console.log('Weight goals:', weightGoals);

  // 6. Update a goal
  const updatedGoal = await updateGoal(weightGoal.goalId, {
    targetValue: 68.0,
    endDate: "2024-04-15",
    description: "Updated weight goal"
  });

  // 7. Get progress for specific goal
  const goalProgress = await getGoalProgress(weightGoal.goalId);
  console.log('Goal progress:', goalProgress);

  // 8. Get progress for all user goals
  const allProgress = await getUserGoalProgress(userId);
  console.log('All progress:', allProgress);

  // 9. Complete a goal when achieved
  if (goalProgress.progressPercentage >= 100) {
    await completeGoal(weightGoal.goalId);
    console.log('Goal completed!');
  }

  // 10. Delete a goal if no longer needed
  // await deleteGoal(calorieGoal.goalId);
};
```

#### Progress Visualization Example
```typescript
// Component for displaying goal progress
const GoalProgressCard = ({ goalId }: { goalId: number }) => {
  const { progress, loading } = useGoalProgress(goalId);

  if (loading) return <div>Loading...</div>;
  if (!progress) return <div>Goal not found</div>;

  return (
    <div className="goal-progress-card">
      <h3>{progress.type} Goal</h3>
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${Math.min(progress.progressPercentage, 100)}%` }}
        />
      </div>
      <p>{progress.progressPercentage.toFixed(1)}% Complete</p>
      <p>Current: {progress.currentValue} / Target: {progress.targetValue}</p>
      <p>Status: {progress.progressStatus}</p>
      {progress.daysRemaining && (
        <p>Days remaining: {progress.daysRemaining}</p>
      )}
      <p>On track: {progress.onTrack ? 'Yes' : 'No'}</p>
    </div>
  );
};
```

# Routine API Documentation

## Base URL
```
/api/routines
```

## Overview
The Routine API provides endpoints for managing workout routines. A routine consists of a collection of exercises, each with multiple sets that define target values for reps, weight, duration, or distance.

---

## Endpoints

### 1. Create Routine
**POST** `/api/routines`

Creates a new workout routine for a user.

#### Request Body
```json
{
  "name": "Push Day",
  "notes": "Upper body push exercises",
  "userId": 1,
  "exercises": [
    {
      "exerciseId": 1,
      "type": "WEIGHT",
      "sortOrder": 1,
      "notes": "Focus on form",
      "sets": [
        {
          "setOrder": 1,
          "targetReps": 10,
          "targetWeight": 135.0,
          "targetDurationMin": null,
          "targetDistanceM": null
        },
        {
          "setOrder": 2,
          "targetReps": 8,
          "targetWeight": 155.0,
          "targetDurationMin": null,
          "targetDistanceM": null
        }
      ]
    },
    {
      "exerciseId": 2,
      "type": "CARDIO",
      "sortOrder": 2,
      "notes": "Steady pace",
      "sets": [
        {
          "setOrder": 1,
          "targetReps": null,
          "targetWeight": null,
          "targetDurationMin": 30.0,
          "targetDistanceM": 5000.0
        }
      ]
    }
  ]
}
```

#### Request Schema
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Routine name (cannot be blank) |
| `notes` | string | ❌ | Optional notes about the routine |
| `userId` | integer | ✅ | ID of the user creating the routine |
| `exercises` | array | ✅ | List of exercises (cannot be empty) |

#### Exercise Schema
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `exerciseId` | integer | ✅ | ID of the exercise |
| `type` | enum | ✅ | Exercise type: `"WEIGHT"` or `"CARDIO"` |
| `sortOrder` | integer | ❌ | Display order (default: 1, minimum: 1) |
| `notes` | string | ❌ | Optional notes about the exercise |
| `sets` | array | ✅ | List of sets (cannot be empty) |

#### Set Schema
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `setOrder` | integer | ❌ | Set order (default: 1, minimum: 1) |
| `targetReps` | integer | ❌ | Target number of repetitions |
| `targetWeight` | number | ❌ | Target weight in kg/lbs |
| `targetDurationMin` | number | ❌ | Target duration in minutes |
| `targetDistanceM` | number | ❌ | Target distance in meters |

#### Response
```json
{
  "routineId": 1,
  "createdByUserId": 1,
  "createdByUsername": "john_doe",
  "name": "Push Day",
  "notes": "Upper body push exercises",
  "lastUpdated": "2024-01-15T10:30:00Z",
  "exercises": [
    {
      "routineExerciseId": 1,
      "exerciseId": 1,
      "exerciseName": "Bench Press",
      "type": "WEIGHT",
      "sortOrder": 1,
      "notes": "Focus on form",
      "sets": [
        {
          "routineSetId": 1,
          "setOrder": 1,
          "targetReps": 10,
          "targetWeight": 135.0,
          "targetDurationMin": null,
          "targetDistanceM": null
        }
      ]
    }
  ]
}
```

#### Status Codes
- `200 OK` - Routine created successfully
- `400 Bad Request` - Validation error
- `404 Not Found` - User not found

---

### 2. Get User Routines
**GET** `/api/routines/user/{userId}`

Retrieves all routines created by a specific user, ordered by name.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | integer | ✅ | ID of the user |

#### Response
```json
[
  {
    "routineId": 1,
    "createdByUserId": 1,
    "createdByUsername": "john_doe",
    "name": "Push Day",
    "notes": "Upper body push exercises",
    "lastUpdated": "2024-01-15T10:30:00Z",
    "exercises": [...]
  },
  {
    "routineId": 2,
    "createdByUserId": 1,
    "createdByUsername": "john_doe",
    "name": "Pull Day",
    "notes": "Upper body pull exercises",
    "lastUpdated": "2024-01-14T09:15:00Z",
    "exercises": [...]
  }
]
```

#### Status Codes
- `200 OK` - Routines retrieved successfully
- `404 Not Found` - User not found

---

### 3. Get Routine
**GET** `/api/routines/{routineId}`

Retrieves a specific routine by its ID.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `routineId` | integer | ✅ | ID of the routine |

#### Response
```json
{
  "routineId": 1,
  "createdByUserId": 1,
  "createdByUsername": "john_doe",
  "name": "Push Day",
  "notes": "Upper body push exercises",
  "lastUpdated": "2024-01-15T10:30:00Z",
  "exercises": [
    {
      "routineExerciseId": 1,
      "exerciseId": 1,
      "exerciseName": "Bench Press",
      "type": "WEIGHT",
      "sortOrder": 1,
      "notes": "Focus on form",
      "sets": [
        {
          "routineSetId": 1,
          "setOrder": 1,
          "targetReps": 10,
          "targetWeight": 135.0,
          "targetDurationMin": null,
          "targetDistanceM": null
        }
      ]
    }
  ]
}
```

#### Status Codes
- `200 OK` - Routine retrieved successfully
- `404 Not Found` - Routine not found

---

### 4. Update Routine
**PUT** `/api/routines/{routineId}`

Updates an existing routine. This replaces all exercises and sets in the routine.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `routineId` | integer | ✅ | ID of the routine to update |

#### Request Body
```json
{
  "name": "Updated Push Day",
  "notes": "Updated upper body push exercises",
  "exercises": [
    {
      "exerciseId": 1,
      "type": "WEIGHT",
      "sortOrder": 1,
      "notes": "Focus on form",
      "sets": [
        {
          "setOrder": 1,
          "targetReps": 12,
          "targetWeight": 140.0,
          "targetDurationMin": null,
          "targetDistanceM": null
        }
      ]
    }
  ]
}
```

#### Request Schema
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Routine name (cannot be blank) |
| `notes` | string | ❌ | Optional notes about the routine |
| `exercises` | array | ❌ | List of exercises (optional) |

**Note:** The exercise and set schemas are the same as in the create routine endpoint.

#### Response
Returns the updated routine in the same format as the create routine response.

#### Status Codes
- `200 OK` - Routine updated successfully
- `400 Bad Request` - Validation error
- `404 Not Found` - Routine not found

---

### 5. Delete Routine
**DELETE** `/api/routines/{routineId}`

Deletes a routine and all its associated exercises and sets.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `routineId` | integer | ✅ | ID of the routine to delete |

#### Response
No content body.

#### Status Codes
- `204 No Content` - Routine deleted successfully
- `404 Not Found` - Routine not found

---

## Data Types

### ExerciseType Enum
- `"WEIGHT"` - Weight/resistance training exercises
- `"CARDIO"` - Cardiovascular exercises

### Timestamp Format
All timestamps are returned in ISO 8601 format (UTC): `"2024-01-15T10:30:00Z"`

---

## Error Handling

### Common Error Response Format
```json
{
  "error": "Error message",
  "status": 400,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Common Status Codes
- `200 OK` - Request successful
- `204 No Content` - Request successful, no content returned
- `400 Bad Request` - Validation error or malformed request
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Usage Examples

### Frontend Integration Examples

#### JavaScript/TypeScript
```typescript
// Create a routine
const createRoutine = async (routineData: CreateRoutineRequest) => {
  const response = await fetch('/api/routines', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(routineData)
  });
  return response.json();
};

// Get user routines
const getUserRoutines = async (userId: number) => {
  const response = await fetch(`/api/routines/user/${userId}`);
  return response.json();
};

// Update routine
const updateRoutine = async (routineId: number, updateData: UpdateRoutineRequest) => {
  const response = await fetch(`/api/routines/${routineId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData)
  });
  return response.json();
};
```

#### React Hook Example
```typescript
const useRoutines = (userId: number) => {
  const [routines, setRoutines] = useState<RoutineResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const data = await getUserRoutines(userId);
        setRoutines(data);
      } catch (error) {
        console.error('Failed to fetch routines:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutines();
  }, [userId]);

  return { routines, loading };
};
```

---

# Workout Session API Documentation

## Base URL
```
/api/workouts
```

## Overview
The Workout Session API provides endpoints for managing workout sessions. A workout session represents a single workout instance where users can log exercises and track their performance with sets. This is different from routines, which are templates - workout sessions are actual completed workouts.

---

## Endpoints

### 1. Create Workout Session
**POST** `/api/workouts`

Creates a new workout session for a user.

#### Request Body
```json
{
  "userId": 1,
  "date": "2024-01-15",
  "notes": "Morning push workout"
}
```

#### Request Schema
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | integer | ✅ | ID of the user creating the workout |
| `date` | string (date) | ✅ | Date of the workout (YYYY-MM-DD format) |
| `notes` | string | ❌ | Optional notes about the workout |

#### Response
```json
{
  "workoutId": 1,
  "userId": 1,
  "date": "2024-01-15",
  "startTime": null,
  "endTime": null,
  "notes": "Morning push workout",
  "exercises": []
}
```

#### Status Codes
- `200 OK` - Workout session created successfully
- `400 Bad Request` - Validation error
- `404 Not Found` - User not found

---

### 2. Get Workout Session
**GET** `/api/workouts/{workoutId}`

Retrieves a specific workout session by its ID, including all exercises and sets.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `workoutId` | integer | ✅ | ID of the workout session |

#### Response
```json
{
  "workoutId": 1,
  "userId": 1,
  "date": "2024-01-15",
  "startTime": "09:00:00",
  "endTime": "10:30:00",
  "notes": "Morning push workout",
  "exercises": [
    {
      "sessionExerciseId": 1,
      "exerciseId": 1,
      "exerciseName": "Bench Press",
      "type": "WEIGHT",
      "sortOrder": 1,
      "notes": "Focus on form",
      "sets": [
        {
          "sessionSetId": 1,
          "setOrder": 1,
          "reps": 10,
          "weight": 135.0,
          "rpe": 7.5,
          "durationMin": null,
          "distanceM": null,
          "caloriesBurned": null
        }
      ]
    }
  ]
}
```

#### Status Codes
- `200 OK` - Workout session retrieved successfully
- `404 Not Found` - Workout session not found

---

### 3. Get User Workout Sessions
**GET** `/api/workouts/user/{userId}`

Retrieves all workout sessions for a specific user, ordered by date (most recent first).

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | integer | ✅ | ID of the user |

#### Response
```json
[
  {
    "workoutId": 1,
    "userId": 1,
    "date": "2024-01-15",
    "startTime": "09:00:00",
    "endTime": "10:30:00",
    "notes": "Morning push workout",
    "exercises": [...]
  },
  {
    "workoutId": 2,
    "userId": 1,
    "date": "2024-01-14",
    "startTime": "18:00:00",
    "endTime": "19:15:00",
    "notes": "Evening pull workout",
    "exercises": [...]
  }
]
```

#### Status Codes
- `200 OK` - Workout sessions retrieved successfully
- `404 Not Found` - User not found

---

### 4. Get Workout Exercises
**GET** `/api/workouts/{workoutId}/exercises`

Retrieves all exercises for a specific workout session.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `workoutId` | integer | ✅ | ID of the workout session |

#### Response
```json
[
  {
    "sessionExerciseId": 1,
    "exerciseId": 1,
    "exerciseName": "Bench Press",
    "type": "WEIGHT",
    "sortOrder": 1,
    "notes": "Focus on form",
    "sets": []
  },
  {
    "sessionExerciseId": 2,
    "exerciseId": 2,
    "exerciseName": "Running",
    "type": "CARDIO",
    "sortOrder": 2,
    "notes": "Steady pace",
    "sets": []
  }
]
```

#### Status Codes
- `200 OK` - Exercises retrieved successfully
- `404 Not Found` - Workout session not found

---

### 5. Add Exercise to Workout
**POST** `/api/workouts/{workoutId}/exercises`

Adds an exercise to an existing workout session.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `workoutId` | integer | ✅ | ID of the workout session |

#### Request Body
```json
{
  "exerciseId": 1,
  "type": "WEIGHT",
  "sortOrder": 1,
  "notes": "Focus on form"
}
```

#### Request Schema
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `exerciseId` | integer | ✅ | ID of the exercise to add |
| `type` | enum | ✅ | Exercise type: `"WEIGHT"` or `"CARDIO"` |
| `sortOrder` | integer | ❌ | Display order (default: 1, minimum: 1) |
| `notes` | string | ❌ | Optional notes about the exercise |

#### Response
```json
{
  "sessionExerciseId": 1,
  "exerciseId": 1,
  "exerciseName": "Bench Press",
  "type": "WEIGHT",
  "sortOrder": 1,
  "notes": "Focus on form",
  "sets": []
}
```

#### Status Codes
- `200 OK` - Exercise added successfully
- `400 Bad Request` - Validation error
- `404 Not Found` - Workout session or exercise not found

---

### 6. Get Exercise Sets
**GET** `/api/workouts/{workoutId}/exercises/{sessionExerciseId}/sets`

Retrieves all sets for a specific exercise in a workout session.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `workoutId` | integer | ✅ | ID of the workout session |
| `sessionExerciseId` | integer | ✅ | ID of the session exercise |

#### Response
```json
[
  {
    "sessionSetId": 1,
    "setOrder": 1,
    "reps": 10,
    "weight": 135.0,
    "rpe": 7.5,
    "durationMin": null,
    "distanceM": null,
    "caloriesBurned": null
  },
  {
    "sessionSetId": 2,
    "setOrder": 2,
    "reps": 8,
    "weight": 155.0,
    "rpe": 8.0,
    "durationMin": null,
    "distanceM": null,
    "caloriesBurned": null
  }
]
```

#### Status Codes
- `200 OK` - Sets retrieved successfully
- `404 Not Found` - Session exercise not found

---

### 7. Log Set
**POST** `/api/workouts/{workoutId}/exercises/{sessionExerciseId}/sets`

Logs a completed set for an exercise in a workout session.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `workoutId` | integer | ✅ | ID of the workout session |
| `sessionExerciseId` | integer | ✅ | ID of the session exercise |

#### Request Body
```json
{
  "setOrder": 1,
  "reps": 10,
  "weight": 135.0,
  "rpe": 7.5,
  "durationMin": null,
  "distanceM": null,
  "caloriesBurned": null
}
```

#### Request Schema
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `setOrder` | integer | ✅ | Set order (minimum: 1) |
| `reps` | integer | ❌ | Number of repetitions completed |
| `weight` | number | ❌ | Weight used (in kg/lbs) |
| `rpe` | number | ❌ | Rate of Perceived Exertion (1-10 scale) |
| `durationMin` | number | ❌ | Duration in minutes (for cardio) |
| `distanceM` | number | ❌ | Distance in meters (for cardio) |
| `caloriesBurned` | number | ❌ | Calories burned (for cardio) |

#### Response
```json
{
  "sessionSetId": 1,
  "setOrder": 1,
  "reps": 10,
  "weight": 135.0,
  "rpe": 7.5,
  "durationMin": null,
  "distanceM": null,
  "caloriesBurned": null
}
```

#### Status Codes
- `200 OK` - Set logged successfully
- `400 Bad Request` - Validation error
- `404 Not Found` - Session exercise not found

---

### 8. Update Workout Session (Bulk)
**PUT** `/api/workouts/{workoutId}`

Updates an entire workout session including metadata, exercises, and sets in a single atomic operation.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `workoutId` | integer | ✅ | ID of the workout session to update |

#### Request Body
```json
{
  "date": "2024-01-15",
  "startTime": "09:00:00",
  "endTime": "10:30:00",
  "notes": "Updated morning workout",
  "exercises": [
    {
      "sessionExerciseId": 1,
      "exerciseId": 1,
      "type": "WEIGHT",
      "sortOrder": 1,
      "notes": "Updated bench press",
      "sets": [
        {
          "sessionSetId": 1,
          "setOrder": 1,
          "reps": 12,
          "weight": 140.0,
          "rpe": 8.0
        },
        {
          "sessionSetId": 2,
          "setOrder": 2,
          "reps": 10,
          "weight": 150.0,
          "rpe": 8.5
        }
      ]
    },
    {
      "exerciseId": 2,
      "type": "CARDIO",
      "sortOrder": 2,
      "notes": "New cardio exercise",
      "sets": [
        {
          "setOrder": 1,
          "durationMin": 30.0,
          "distanceM": 5000.0,
          "caloriesBurned": 300.0
        }
      ]
    }
  ]
}
```

#### Request Schema
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `date` | string (date) | ❌ | Workout date (YYYY-MM-DD format) |
| `startTime` | string (time) | ❌ | Workout start time (HH:mm:ss format) |
| `endTime` | string (time) | ❌ | Workout end time (HH:mm:ss format) |
| `notes` | string | ❌ | Workout notes |
| `exercises` | array | ❌ | Array of exercises to update/create |

#### Exercise Schema
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `sessionExerciseId` | integer | ❌ | ID of existing exercise (null for new exercises) |
| `exerciseId` | integer | ✅ | ID of the exercise type |
| `type` | enum | ✅ | Exercise type: `"WEIGHT"` or `"CARDIO"` |
| `sortOrder` | integer | ❌ | Display order (default: 1) |
| `notes` | string | ❌ | Exercise notes |
| `sets` | array | ❌ | Array of sets for this exercise |

#### Set Schema
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `sessionSetId` | integer | ❌ | ID of existing set (null for new sets) |
| `setOrder` | integer | ✅ | Set order (minimum: 1) |
| `reps` | integer | ❌ | Number of repetitions |
| `weight` | number | ❌ | Weight used (in kg/lbs) |
| `rpe` | number | ❌ | Rate of Perceived Exertion (1-10 scale) |
| `durationMin` | number | ❌ | Duration in minutes (for cardio) |
| `distanceM` | number | ❌ | Distance in meters (for cardio) |
| `caloriesBurned` | number | ❌ | Calories burned (for cardio) |

#### Response
```json
{
  "workoutId": 1,
  "userId": 1,
  "date": "2024-01-15",
  "startTime": "09:00:00",
  "endTime": "10:30:00",
  "notes": "Updated morning workout",
  "exercises": [
    {
      "sessionExerciseId": 1,
      "exerciseId": 1,
      "exerciseName": "Bench Press",
      "type": "WEIGHT",
      "sortOrder": 1,
      "notes": "Updated bench press",
      "sets": [
        {
          "sessionSetId": 1,
          "setOrder": 1,
          "reps": 12,
          "weight": 140.0,
          "rpe": 8.0,
          "durationMin": null,
          "distanceM": null,
          "caloriesBurned": null
        },
        {
          "sessionSetId": 2,
          "setOrder": 2,
          "reps": 10,
          "weight": 150.0,
          "rpe": 8.5,
          "durationMin": null,
          "distanceM": null,
          "caloriesBurned": null
        }
      ]
    },
    {
      "sessionExerciseId": 2,
      "exerciseId": 2,
      "exerciseName": "Running",
      "type": "CARDIO",
      "sortOrder": 2,
      "notes": "New cardio exercise",
      "sets": [
        {
          "sessionSetId": 3,
          "setOrder": 1,
          "reps": null,
          "weight": null,
          "rpe": null,
          "durationMin": 30.0,
          "distanceM": 5000.0,
          "caloriesBurned": 300.0
        }
      ]
    }
  ]
}
```

#### Status Codes
- `200 OK` - Workout updated successfully
- `400 Bad Request` - Validation error
- `404 Not Found` - Workout session not found
- `403 Forbidden` - User doesn't own the workout

#### Important Notes
- **Atomic Operation**: All changes succeed or fail together
- **Replace Strategy**: Existing exercises not included in the request will be deleted
- **Partial Updates**: Only include fields you want to update (all fields are optional)
- **New vs Existing**: Use `sessionExerciseId`/`sessionSetId` for existing items, omit for new items

---

### 9. Delete Workout Session
**DELETE** `/api/workouts/{workoutId}`

Deletes an entire workout session including all exercises and sets.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `workoutId` | integer | ✅ | ID of the workout session to delete |

#### Response
- **Status Code**: `204 No Content` - Workout deleted successfully
- **Body**: Empty

#### Status Codes
- `204 No Content` - Workout deleted successfully
- `404 Not Found` - Workout session not found
- `403 Forbidden` - User doesn't own the workout

#### Important Notes
- **Cascade Delete**: All exercises and sets are automatically deleted
- **Permanent**: This action cannot be undone
- **Authorization**: Users can only delete their own workouts

---

## Data Types

### ExerciseType Enum
- `"WEIGHT"` - Weight/resistance training exercises
- `"CARDIO"` - Cardiovascular exercises

### Date/Time Formats
- **Date**: ISO 8601 date format: `"2024-01-15"`
- **Time**: ISO 8601 time format: `"09:00:00"` or `"09:00:00.000"`

### RPE (Rate of Perceived Exertion)
Scale from 1-10 where:
- 1-2: Very light
- 3-4: Light
- 5-6: Moderate
- 7-8: Hard
- 9-10: Maximum effort

---

## Error Handling

### Common Error Response Format
```json
{
  "error": "Error message",
  "status": 400,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Common Status Codes
- `200 OK` - Request successful
- `400 Bad Request` - Validation error or malformed request
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Usage Examples

### Frontend Integration Examples

#### JavaScript/TypeScript
```typescript
// Create a workout session
const createWorkout = async (workoutData: CreateWorkoutRequest) => {
  const response = await fetch('/api/workouts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(workoutData)
  });
  return response.json();
};

// Get user workouts
const getUserWorkouts = async (userId: number) => {
  const response = await fetch(`/api/workouts/user/${userId}`);
  return response.json();
};

// Add exercise to workout
const addExerciseToWorkout = async (workoutId: number, exerciseData: AddExerciseToWorkoutRequest) => {
  const response = await fetch(`/api/workouts/${workoutId}/exercises`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(exerciseData)
  });
  return response.json();
};

// Log a set
const logSet = async (workoutId: number, sessionExerciseId: number, setData: LogSetRequest) => {
  const response = await fetch(`/api/workouts/${workoutId}/exercises/${sessionExerciseId}/sets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(setData)
  });
  return response.json();
};

// Update entire workout
const updateWorkout = async (workoutId: number, workoutData: UpdateWorkoutRequest) => {
  const response = await fetch(`/api/workouts/${workoutId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(workoutData)
  });
  return response.json();
};

// Delete workout
const deleteWorkout = async (workoutId: number) => {
  const response = await fetch(`/api/workouts/${workoutId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.status === 204; // Returns true if successful
};
```

#### React Hook Example
```typescript
const useWorkoutSession = (workoutId: number) => {
  const [workout, setWorkout] = useState<WorkoutResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const response = await fetch(`/api/workouts/${workoutId}`);
        const data = await response.json();
        setWorkout(data);
      } catch (error) {
        console.error('Failed to fetch workout:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkout();
  }, [workoutId]);

  return { workout, loading };
};
```

#### Complete Workout Flow Example
```typescript
// Complete workflow for creating and logging a workout
const createAndLogWorkout = async (userId: number) => {
  // 1. Create workout session
  const workout = await createWorkout({
    userId,
    date: new Date().toISOString().split('T')[0], // Today's date
    notes: "Morning workout"
  });

  // 2. Add exercises
  const benchPress = await addExerciseToWorkout(workout.workoutId, {
    exerciseId: 1,
    type: "WEIGHT",
    sortOrder: 1,
    notes: "Focus on form"
  });

  const running = await addExerciseToWorkout(workout.workoutId, {
    exerciseId: 2,
    type: "CARDIO",
    sortOrder: 2,
    notes: "Steady pace"
  });

  // 3. Log sets for weight exercise
  await logSet(workout.workoutId, benchPress.sessionExerciseId, {
    setOrder: 1,
    reps: 10,
    weight: 135.0,
    rpe: 7.5
  });

  await logSet(workout.workoutId, benchPress.sessionExerciseId, {
    setOrder: 2,
    reps: 8,
    weight: 155.0,
    rpe: 8.0
  });

  // 4. Log sets for cardio exercise
  await logSet(workout.workoutId, running.sessionExerciseId, {
    setOrder: 1,
    durationMin: 30.0,
    distanceM: 5000.0,
    caloriesBurned: 300.0
  });

  return workout;
};

// Bulk update example - update entire workout in one call
const updateEntireWorkout = async (workoutId: number) => {
  const updatedWorkout = await updateWorkout(workoutId, {
    date: "2024-01-16",
    startTime: "10:00:00",
    endTime: "11:30:00",
    notes: "Updated workout with new exercises and improved weights",
    exercises: [
      {
        sessionExerciseId: 1, // Existing exercise
        exerciseId: 1,
        type: "WEIGHT",
        sortOrder: 1,
        notes: "Improved bench press form",
        sets: [
          {
            sessionSetId: 1, // Existing set
            setOrder: 1,
            reps: 12,
            weight: 145.0,
            rpe: 8.0
          },
          {
            sessionSetId: 2, // Existing set
            setOrder: 2,
            reps: 10,
            weight: 155.0,
            rpe: 8.5
          },
          {
            // New set (no sessionSetId)
            setOrder: 3,
            reps: 8,
            weight: 165.0,
            rpe: 9.0
          }
        ]
      },
      {
        // New exercise (no sessionExerciseId)
        exerciseId: 3,
        type: "CARDIO",
        sortOrder: 2,
        notes: "Added cardio session",
        sets: [
          {
            setOrder: 1,
            durationMin: 20.0,
            distanceM: 3000.0,
            caloriesBurned: 200.0
          }
        ]
      }
    ]
  });
  
  return updatedWorkout;
};
```
