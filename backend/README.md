# Backend – Fitness & Nutrition Planner

This is the Spring Boot backend service for the Fitness & Nutrition Planner.
It provides APIs for user management, workout logging, nutrition tracking, and goals, backed by a SQLite database managed via Flyway migrations.


## Getting Started
### 1. Prerequisites
   - Java 17+ (ensure `java -version` shows 17)
   - Gradle (or use the included Gradle wrapper `./gradlew`)
   - Git

### 2. Clone the repo
### 3. Profiles & Databases
The backend uses **Spring profiles** to separate environments:

| Profile | Database | Description |
|---------|----------|-------------|
| `dev`   | `./data/novafit-dev.db` | Schema + seed data for development/testing APIs with demo users, exercises, foods, etc. |
| `test`  | In-memory SQLite (`jdbc:sqlite::memory:`) | Schema only (no seed data), isolated per test run. Used automatically by `./gradlew test`. |
| `prod`  | `./data/novafit.db` | Schema only. No demo data. Used for deployment. |

Flyway migrations live in `src/main/resources/db/migration/`:
- `common/` → schema migrations (`V1__init.sql`, etc.)
- `dev/` → seed/demo data migrations (`V2__seed_data.sql`)

### 4. Run in Development
From the backend folder:
```bash
./gradlew bootRun --args='--spring.profiles.active=dev'
```
The app will start at http://localhost:8080.

### 5. Run Tests
```bash
./gradlew clean test
```
- Uses the test profile with an in-memory DB.
- Flyway applies schema migrations fresh each run.
- No seed data is loaded.
- JaCoCo coverage report is automatically generated after tests run.

### 5.1. Generate Code Coverage Report
```bash
./gradlew test jacocoTestReport
```
Or simply:
```bash
./gradlew test  # Coverage report is generated automatically
```

Coverage reports are generated in:
- **HTML Report**: `build/reports/jacoco/html/index.html` (open in browser)
- **XML Report**: `build/reports/jacoco/xml/jacoco.xml` (for CI/CD integration)

To verify coverage thresholds:
```bash
./gradlew test jacocoTestCoverageVerification
```
This will fail the build if coverage is below the configured thresholds (currently 60% overall, 70% for services and controllers).

### 6. Build a JAR
```bash
./gradlew clean build
```
This produces a runnable JAR under `build/libs/`

### 7. Database Migrations
- Do not commit `.db` files — they are ignored via `.gitignore`.
- To evolve the schema, add a new Flyway migration under `db/migration/common/` like:
    ```pgsql
    V3__add_new_table.sql
    ```
- For new demo data, add a migration under `db/migration/dev/`.
Run locally with `--spring.profiles.active=dev` to confirm migrations apply.

## Project Structure (Backend)
```bash
backend/
 ├─ src/main/java/com/example/demo/   # Spring Boot code
 │   ├─ controller/                   # REST controllers
 │   ├─ model/                        # JPA entities
 │   ├─ repository/                   # Spring Data JPA repositories
 │   └─ service/                      # Business logic
 │
 ├─ src/main/resources/
 │   ├─ db/migration/common/          # Schema migrations (Flyway)
 │   ├─ db/migration/dev/             # Seed/demo data
 │   └─ application.yml               # Base config
 │
 ├─ src/test/java/                    # JUnit + Spring Boot tests
 ├─ data/                             # SQLite databases (ignored by git)
 └─ build.gradle                      # Gradle build file
```

## Example API Calls
### Register new user (POST):

```bash
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "username": "alice123",
    "password": "SuperSecret123",
    "firstName": "Alice",
    "lastName": "Smith",
    "dateOfBirth": "2000-05-15",
    "sex": "female",
    "heightCm": 165,
    "weightKg": 60,
    "activityLevel": "moderate",
    "timezone": "Australia/Sydney",
    "unitWeight": "kg",
    "unitEnergy": "kcal",
    "locale": "en-AU"
  }'
```

### Get user + profile (GET):
```bash
curl http://localhost:8080/api/users/1
```

### Reset Password (POST)
```bash
curl -X POST http://localhost:8080/api/users/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "newPassword": "ResetPassword123"
  }'
```

## Notes
- Always apply schema changes via Flyway migrations instead of editing .db files.
- Use the dev profile for manual testing with demo data.
- CI/CD and tests use the test profile to guarantee clean state.