# Fitness & Nutrition Planner

## Project Overview
The **Fitness & Nutrition Planner** is designed to help users take control of their health by integrating **workout tracking**, **macro logging**, and **personalized health insights** into one streamlined platform.  
It addresses the common problem of fragmented fitness and nutrition tools, where users must rely on multiple apps or manual tracking methods, leading to inefficiency and inconsistency.  

**Key Features**  
- **Workout Logging** – Record exercises, sets, reps, and weights with ease.  
- **Macro Tracking** – Log daily calories and macronutrient intake with automated calculations.  
- **Progress Visualization** – Track long-term improvements through charts and analytics.  
- **Goal Setting** – Stay motivated with custom goals. 

## Team Roles & Responsibilities (Agile/Scrum)

| Member | Role | Responsibilities |
|--------|------|------------------|
| **Mohsin Siddiqui** | **Product Owner (PO)** | Owns the product vision and backlog. Works with stakeholders to define features, prioritize user stories, and ensure the team delivers maximum value to users. |
| **Katholiki Kritharides** | **Scrum Master (SM)** | Facilitates Scrum ceremonies (Sprint Planning, Daily Stand-up, Sprint Review, Retrospective). Removes obstacles, coaches the team on Agile principles, and ensures smooth sprint execution. |
| **Pitcha Weesommai** | **Frontend Developer** | Designs and implements the user interface (UI) and user experience (UX). Works closely with the PO to align UI with user needs and integrates with backend APIs for dynamic data display. |
| **Marium Haider** | **Database Management & Backend Developer** | Designs and maintains the database schema. Implements backend services/APIs for features like progress tracking, macro calculations, and personalized insights. Ensures data integrity, security, and performance. |
| **Caleb ALLEN** | **Quality Assurance & Backend Developer** | Writes and runs manual and automated tests to verify sprint deliverables. Tracks and reports bugs, ensures features meet acceptance criteria, and validates the product from the end-user perspective. Implements backend services/APIs for features like progress tracking, macro calculations, and personalized insights. Ensures data integrity, security, and performance. |

### Schema Design Summary

The database schema supports the **Fitness & Nutrition Planner’s** core features: user management, workout logging, nutrition tracking, goal setting, and progress visualization. It is organized into four main areas: **users & profiles**, **workouts & routines**, **food & nutrition**, and **goals & daily aggregates**.

Users are stored in the `user` table with extended details in `user_profile`, while `daily_totals` caches macro and workout summaries for quick dashboard queries. Workouts are modeled hierarchically: `workout_session` contains `session_exercise` rows, each with detailed `session_set` data. Reusable templates are supported via `routine`, `routine_exercise`, and `routine_set`. Food tracking uses `food_item` for API/custom foods and `food_log` for daily entries, with nutrition values snapshotted at the time of logging. Users can also define `recipe`s built from multiple `recipe_item`s.

Finally, the `goal` table tracks objectives such as calories, weight, or workout frequency. Together, this design ensures normalization for consistency, snapshotting for historical accuracy, and aggregates for performance—covering the key functional requirements of the application.

## Libraries

#### Frontend (JavaScript / React)
 1.⁠ ⁠"apexcharts": "^5.3.5"
<br>
 2.⁠ ⁠"assert": "^2.1.0"
<br>
 3.⁠ ⁠"crypto-browserify": "^3.12.1"
<br>
 4.⁠ ⁠"os-browserify": "^0.3.0"
<br>
 5.⁠ ⁠"path-browserify": "^1.0.1"
<br>
 6.⁠ ⁠"process": "^0.11.10"
<br>
 7.⁠ ⁠"react-apexcharts": "^1.8.0"
<br>
 8.⁠ ⁠"stream-browserify": "^3.0.0"
<br>
 9.⁠ ⁠"tty": "^1.0.1"
<br>
10.⁠ ⁠"url": "^0.11.4"
<br>
11.⁠ ⁠"util": "^0.12.5"
<br>

#### Backend (Java / Spring Boot)
12.⁠ ⁠'org.springframework.boot' version '3.3.3'
<br>
13.⁠ ⁠'io.spring.dependency-management' version '1.1.6'
<br>
14.⁠ ⁠'jacoco' plugin version '0.8.11'
<br>
15.⁠ ⁠Java 17
<br>

#### Spring Boot dependencies
16.⁠ ⁠'org.springframework.boot:spring-boot-starter-web:3.3.3'
<br>
17.⁠ ⁠'org.springframework.boot:spring-boot-starter-data-jpa:3.3.3'
<br>
18.⁠ ⁠'org.springframework.boot:spring-boot-starter-validation:3.3.3'
<br>
19.⁠ ⁠'org.springframework.boot:spring-boot-starter-security:3.3.3'
<br>

#### Database
20.⁠ ⁠'org.xerial:sqlite-jdbc:3.45.3.0'
<br>
21.⁠ ⁠'org.hibernate.orm:hibernate-community-dialects:6.4.4.Final'
<br>
22.⁠ ⁠'org.flywaydb:flyway-core' (compatible with Spring Boot 3.3.3)
<br>
23.⁠ ⁠SQLite database
<br>

#### Encryption & Security
24.⁠ ⁠'org.springframework.security:spring-security-crypto:3.3.3'
<br>
25.⁠ ⁠'io.jsonwebtoken:jjwt-api:0.11.5'
<br>
26.⁠ ⁠'io.jsonwebtoken:jjwt-impl:0.11.5'
<br>
27.⁠ ⁠'io.jsonwebtoken:jjwt-jackson:0.11.5'
<br>

#### Testing
28.⁠ ⁠'org.springframework.boot:spring-boot-starter-test:3.3.3'
<br>
29.⁠ ⁠'org.junit.platform:junit-platform-launcher'
<br>
30.⁠ ⁠'org.junit.jupiter:junit-jupiter:5.10.2'
<br>
