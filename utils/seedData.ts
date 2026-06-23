import * as SQLite from "expo-sqlite";
import * as Crypto from "expo-crypto";
import bcrypt from "bcryptjs";

// Fix: Provide expo-crypto as random fallback for bcryptjs in React Native
bcrypt.setRandomFallback((len: number) => {
  const buf = Crypto.getRandomBytes(len);
  return Array.from(buf);
});

/**
 * Seed sample data into SQLite database.
 * Call this function once to populate test users and tasks.
 * 
 * Sample accounts:
 *   - username: admin    | password: 123456
 *   - username: huantta  | password: 123456
 */
export async function seedDatabase(): Promise<void> {
  const db = await SQLite.openDatabaseAsync("taskmanager.db");

  // Check if data already exists
  const existingUser = await db.getFirstAsync<{ id: number }>(
    "SELECT id FROM users WHERE username = ?",
    ["admin"]
  );

  if (existingUser) {
    console.log("📦 Seed data already exists. Skipping...");
    return;
  }

  console.log("🌱 Seeding sample data...");

  const salt = bcrypt.genSaltSync(10);

  // ===== INSERT SAMPLE USERS =====
  const user1 = await db.runAsync(
    "INSERT INTO users (fullname, email, username, password) VALUES (?, ?, ?, ?)",
    ["Admin User", "admin@example.com", "admin", bcrypt.hashSync("123456", salt)]
  );

  const user2 = await db.runAsync(
    "INSERT INTO users (fullname, email, username, password) VALUES (?, ?, ?, ?)",
    ["Thành Anh Huân", "huan@fpt.edu.vn", "huantta", bcrypt.hashSync("123456", salt)]
  );

  // ===== INSERT SAMPLE TASKS FOR USER 1 (admin) =====
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  // Task 1: High priority with subtasks
  const task1Id = "seed_task_1";
  await db.runAsync(
    `INSERT INTO tasks (id, userId, title, completed, createdAt, tags, priority, startDate, dueDate, note)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      task1Id,
      user1.lastInsertRowId,
      "Complete MMA301 Assignment 2",
      0,
      now.toISOString(),
      JSON.stringify(["Study", "Work"]),
      "High",
      now.toISOString(),
      nextWeek.toISOString(),
      "Implement SQLite database for login and task management",
    ]
  );

  // Subtasks for task 1
  await db.runAsync(
    "INSERT INTO subtasks (id, taskId, title, completed) VALUES (?, ?, ?, ?)",
    ["seed_st_1a", task1Id, "Setup SQLite database", 1]
  );
  await db.runAsync(
    "INSERT INTO subtasks (id, taskId, title, completed) VALUES (?, ?, ?, ?)",
    ["seed_st_1b", task1Id, "Implement Login with bcrypt", 1]
  );
  await db.runAsync(
    "INSERT INTO subtasks (id, taskId, title, completed) VALUES (?, ?, ?, ?)",
    ["seed_st_1c", task1Id, "Persist tasks to SQLite", 0]
  );

  // Task 2: Medium priority
  await db.runAsync(
    `INSERT INTO tasks (id, userId, title, completed, createdAt, tags, priority, startDate, dueDate, note)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      "seed_task_2",
      user1.lastInsertRowId,
      "Practice Badminton 🏸",
      0,
      now.toISOString(),
      JSON.stringify(["Personal", "Badminton 🏸"]),
      "Medium",
      tomorrow.toISOString(),
      tomorrow.toISOString(),
      null,
    ]
  );

  // Task 3: Overdue task
  await db.runAsync(
    `INSERT INTO tasks (id, userId, title, completed, createdAt, tags, priority, startDate, dueDate, note)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      "seed_task_3",
      user1.lastInsertRowId,
      "Submit SDN302 Lab Report",
      0,
      yesterday.toISOString(),
      JSON.stringify(["Study"]),
      "High",
      yesterday.toISOString(),
      yesterday.toISOString(),
      "This task is overdue!",
    ]
  );

  // Task 4: Completed task
  await db.runAsync(
    `INSERT INTO tasks (id, userId, title, completed, createdAt, tags, priority, startDate, dueDate, note)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      "seed_task_4",
      user1.lastInsertRowId,
      "Read React Native documentation",
      1,
      yesterday.toISOString(),
      JSON.stringify(["Study", "Personal"]),
      "Low",
      yesterday.toISOString(),
      now.toISOString(),
      "Finished reading Expo SQLite docs",
    ]
  );

  // ===== INSERT SAMPLE TASKS FOR USER 2 (huantta) =====
  await db.runAsync(
    `INSERT INTO tasks (id, userId, title, completed, createdAt, tags, priority, startDate, dueDate, note)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      "seed_task_5",
      user2.lastInsertRowId,
      "Review Mobile App Project",
      0,
      now.toISOString(),
      JSON.stringify(["Work", "Study"]),
      "High",
      now.toISOString(),
      nextWeek.toISOString(),
      "Review UI/UX and database integration",
    ]
  );

  await db.runAsync(
    `INSERT INTO tasks (id, userId, title, completed, createdAt, tags, priority, startDate, dueDate, note)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      "seed_task_6",
      user2.lastInsertRowId,
      "Go to gym 💪",
      0,
      now.toISOString(),
      JSON.stringify(["Personal"]),
      "Low",
      tomorrow.toISOString(),
      tomorrow.toISOString(),
      null,
    ]
  );

  console.log("✅ Seed data inserted successfully!");
  console.log("📋 Sample accounts:");
  console.log("   👤 admin / 123456");
  console.log("   👤 huantta / 123456");
}
