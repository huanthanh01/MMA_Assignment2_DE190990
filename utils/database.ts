import * as SQLite from "expo-sqlite";
import * as Crypto from "expo-crypto";
import bcrypt from "bcryptjs";
import { Task, Subtask, User } from "../models/types";

// Fix: React Native (Hermes) doesn't have WebCrypto or Node crypto.
// Provide expo-crypto as random fallback for bcryptjs.
bcrypt.setRandomFallback((len: number) => {
  const buf = Crypto.getRandomBytes(len);
  return Array.from(buf);
});

let db: SQLite.SQLiteDatabase | null = null;

export function getDB(): SQLite.SQLiteDatabase {
  if (!db) throw new Error("Database not initialized");
  return db;
}

// ==================== DATABASE INITIALIZATION ====================

export async function initDB(): Promise<void> {
  if (db) return;
  db = await SQLite.openDatabaseAsync("taskmanager.db");

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fullname TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      createdAt TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      userId INTEGER NOT NULL,
      title TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      createdAt TEXT NOT NULL,
      tags TEXT,
      priority TEXT DEFAULT 'Medium',
      startDate TEXT,
      dueDate TEXT,
      note TEXT,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS subtasks (
      id TEXT PRIMARY KEY,
      taskId TEXT NOT NULL,
      title TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      FOREIGN KEY (taskId) REFERENCES tasks(id) ON DELETE CASCADE
    );
  `);
}

// ==================== USER AUTHENTICATION ====================

export async function registerUser(
  fullname: string,
  email: string,
  username: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: User }> {
  if (!db) await initDB();

  try {
    // Hash password with bcryptjs asynchronously (prevents UI freeze)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await db!.runAsync(
      "INSERT INTO users (fullname, email, username, password) VALUES (?, ?, ?, ?)",
      fullname, email, username, hashedPassword
    );

    return {
      success: true,
      user: {
        id: result.lastInsertRowId,
        fullname,
        email,
        username,
      },
    };
  } catch (error: any) {
    const msg = error?.message || "";
    if (msg.includes("UNIQUE") && msg.includes("username")) {
      return { success: false, error: "Username already exists" };
    }
    if (msg.includes("UNIQUE") && msg.includes("email")) {
      return { success: false, error: "Email already exists" };
    }
    return { success: false, error: "Registration failed. Please try again." };
  }
}

export async function loginUser(
  username: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: User }> {
  if (!db) await initDB();

  const row = await db!.getFirstAsync<{
    id: number;
    fullname: string;
    email: string;
    username: string;
    password: string;
  }>("SELECT * FROM users WHERE username = ?", username);

  if (!row) {
    return { success: false, error: "Invalid username or password" };
  }

  // Compare password with bcryptjs asynchronously (prevents UI freeze)
  const isMatch = await bcrypt.compare(password, row.password);
  if (!isMatch) {
    return { success: false, error: "Invalid username or password" };
  }

  return {
    success: true,
    user: {
      id: row.id,
      fullname: row.fullname,
      email: row.email,
      username: row.username,
    },
  };
}

export async function updateUserProfileDB(
  userId: number,
  fullname: string,
  email: string
): Promise<{ success: boolean; error?: string }> {
  if (!db) await initDB();

  try {
    await db!.runAsync(
      "UPDATE users SET fullname = ?, email = ? WHERE id = ?",
      fullname, email, userId
    );
    return { success: true };
  } catch (error: any) {
    const msg = error?.message || "";
    if (msg.includes("UNIQUE") && msg.includes("email")) {
      return { success: false, error: "Email already exists" };
    }
    return { success: false, error: "Failed to update profile. Please try again." };
  }
}

// ==================== FORGOT PASSWORD ====================

export async function verifyUserAccount(
  username: string,
  email: string
): Promise<{ success: boolean; error?: string; userId?: number }> {
  if (!db) await initDB();

  const row = await db!.getFirstAsync<{ id: number }>(
    "SELECT id FROM users WHERE username = ? AND email = ?",
    username,
    email
  );

  if (!row) {
    return { success: false, error: "No account found with that username and email" };
  }

  return { success: true, userId: row.id };
}

export async function resetUserPassword(
  userId: number,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  if (!db) await initDB();

  // Validate password policy: 8+ chars, 1 uppercase, 1 digit
  if (newPassword.length < 8) {
    return { success: false, error: "Password must be at least 8 characters" };
  }
  if (!/[A-Z]/.test(newPassword)) {
    return { success: false, error: "Password must contain at least 1 uppercase letter" };
  }
  if (!/[0-9]/.test(newPassword)) {
    return { success: false, error: "Password must contain at least 1 number" };
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await db!.runAsync(
      "UPDATE users SET password = ? WHERE id = ?",
      hashedPassword,
      userId
    );
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to reset password. Please try again." };
  }
}

// ==================== TASK CRUD OPERATIONS ====================

export async function getTasksByUser(userId: number): Promise<Task[]> {
  if (!db) await initDB();

  const rows = await db!.getAllAsync<{
    id: string;
    userId: number;
    title: string;
    completed: number;
    createdAt: string;
    tags: string | null;
    priority: string;
    startDate: string | null;
    dueDate: string | null;
    note: string | null;
  }>("SELECT * FROM tasks WHERE userId = ? ORDER BY createdAt DESC", userId);

  const tasks: Task[] = [];

  for (const row of rows) {
    // Fetch subtasks for each task
    const subtaskRows = await db!.getAllAsync<{
      id: string;
      taskId: string;
      title: string;
      completed: number;
    }>("SELECT * FROM subtasks WHERE taskId = ?", row.id);

    const subtasks: Subtask[] = subtaskRows.map((st) => ({
      id: st.id,
      title: st.title,
      completed: st.completed === 1,
    }));

    tasks.push({
      id: row.id,
      title: row.title,
      completed: row.completed === 1,
      createdAt: new Date(row.createdAt),
      tags: row.tags ? JSON.parse(row.tags) : undefined,
      priority: row.priority as Task["priority"],
      startDate: row.startDate ? new Date(row.startDate) : undefined,
      dueDate: row.dueDate ? new Date(row.dueDate) : undefined,
      note: row.note || undefined,
      subtasks: subtasks.length > 0 ? subtasks : undefined,
    });
  }

  return tasks;
}

export async function addTaskDB(userId: number, task: Task): Promise<void> {
  if (!db) await initDB();

  await db!.runAsync(
    `INSERT INTO tasks (id, userId, title, completed, createdAt, tags, priority, startDate, dueDate, note)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      task.id,
      userId,
      task.title,
      task.completed ? 1 : 0,
      task.createdAt.toISOString(),
      task.tags ? JSON.stringify(task.tags) : null,
      task.priority,
      task.startDate ? task.startDate.toISOString() : null,
      task.dueDate ? task.dueDate.toISOString() : null,
      task.note || null
  );

  // Insert subtasks
  if (task.subtasks && task.subtasks.length > 0) {
    for (const st of task.subtasks) {
      await db!.runAsync(
        "INSERT INTO subtasks (id, taskId, title, completed) VALUES (?, ?, ?, ?)",
        st.id, task.id, st.title, st.completed ? 1 : 0
      );
    }
  }
}

export async function updateTaskDB(task: Task): Promise<void> {
  if (!db) await initDB();

  await db!.runAsync(
    `UPDATE tasks SET title = ?, completed = ?, tags = ?, priority = ?, 
     startDate = ?, dueDate = ?, note = ? WHERE id = ?`,
      task.title,
      task.completed ? 1 : 0,
      task.tags ? JSON.stringify(task.tags) : null,
      task.priority,
      task.startDate ? task.startDate.toISOString() : null,
      task.dueDate ? task.dueDate.toISOString() : null,
      task.note || null,
      task.id
  );

  // Re-sync subtasks: delete all old, insert new
  await db!.runAsync("DELETE FROM subtasks WHERE taskId = ?", task.id);
  if (task.subtasks && task.subtasks.length > 0) {
    for (const st of task.subtasks) {
      await db!.runAsync(
        "INSERT INTO subtasks (id, taskId, title, completed) VALUES (?, ?, ?, ?)",
        st.id, task.id, st.title, st.completed ? 1 : 0
      );
    }
  }
}

export async function deleteTaskDB(taskId: string): Promise<void> {
  if (!db) await initDB();

  // Subtasks will be cascade-deleted due to FK constraint
  await db!.runAsync("DELETE FROM subtasks WHERE taskId = ?", taskId);
  await db!.runAsync("DELETE FROM tasks WHERE id = ?", taskId);
}

export async function toggleTaskCompleteDB(
  taskId: string,
  completed: boolean
): Promise<void> {
  if (!db) await initDB();

  await db!.runAsync("UPDATE tasks SET completed = ? WHERE id = ?", 
    completed ? 1 : 0,
    taskId
  );
}

export async function toggleSubtaskCompleteDB(
  subtaskId: string,
  completed: boolean
): Promise<void> {
  if (!db) await initDB();

  await db!.runAsync("UPDATE subtasks SET completed = ? WHERE id = ?", 
    completed ? 1 : 0,
    subtaskId
  );
}

export async function updateTaskTitleNoteSubtasksDB(
  taskId: string,
  title: string,
  note?: string,
  subtasks?: Subtask[]
): Promise<void> {
  if (!db) await initDB();

  await db!.runAsync("UPDATE tasks SET title = ?, note = ? WHERE id = ?", 
    title,
    note || null,
    taskId
  );

  // Re-sync subtasks
  await db!.runAsync("DELETE FROM subtasks WHERE taskId = ?", taskId);
  if (subtasks && subtasks.length > 0) {
    for (const st of subtasks) {
      await db!.runAsync(
        "INSERT INTO subtasks (id, taskId, title, completed) VALUES (?, ?, ?, ?)",
        st.id, taskId, st.title, st.completed ? 1 : 0
      );
    }
  }
}

// ==================== ADMIN OPERATIONS ====================

export async function getAllUsersDB(): Promise<User[]> {
  if (!db) await initDB();
  const rows = await db!.getAllAsync<User>("SELECT id, fullname, email, username FROM users WHERE 1 = ? ORDER BY id ASC", 1);
  return rows;
}

export async function getAllTasksCountDB(): Promise<number> {
  if (!db) await initDB();
  const result = await db!.getFirstAsync<{ count: number }>("SELECT COUNT(*) as count FROM tasks WHERE 1 = ?", 1);
  return result?.count || 0;
}

export async function deleteUserDB(userId: number): Promise<void> {
  if (!db) await initDB();
  // Cascading deletes will handle tasks and subtasks
  await db!.runAsync("DELETE FROM users WHERE id = ?", userId);
}

export async function clearAllDataDB(): Promise<void> {
  if (!db) await initDB();
  await db!.execAsync(`
    DELETE FROM subtasks;
    DELETE FROM tasks;
    DELETE FROM users;
    
    -- Reset auto-increment counters
    DELETE FROM sqlite_sequence WHERE name IN ('users', 'tasks', 'subtasks');
  `);
}
