
// AUTHOR: 𝐑𝐉 𝐬𝐢𝐲𝐚𝐦
// WARNING: AUTHOR পরিবর্তন করলে এই ফাইল Disable হবে।

import fs from "fs-extra";
import path from "path";
import { CONFIG } from "../config.js";

const DB_DIR = path.resolve(
  process.cwd(),
  process.env.DATABASE_DIR ||
  CONFIG?.DATABASE?.DIRECTORY ||
  CONFIG?.DATABASE_DIR ||
  "./database"
);

// Database directory তৈরি
await fs.ensureDir(DB_DIR);

// ডেটা পড়া
export async function readData(name, fallback = {}) {
  const file = path.join(DB_DIR, `${name}.json`);

  try {
    if (!(await fs.pathExists(file))) {
      return fallback;
    }

    return await fs.readJson(file);
  } catch (error) {
    console.error(`Database read error: ${name}`, error);
    return fallback;
  }
}

// ডেটা সংরক্ষণ
export async function writeData(name, data) {
  const file = path.join(DB_DIR, `${name}.json`);
  const tempFile = `${file}.tmp`;

  await fs.ensureDir(DB_DIR);

  await fs.writeFile(
    tempFile,
    JSON.stringify(data, null, 2),
    "utf8"
  );

  await fs.move(tempFile, file, { overwrite: true });

  return true;
}

// ডেটা মুছে ফেলা
export async function deleteData(name) {
  const file = path.join(DB_DIR, `${name}.json`);

  if (await fs.pathExists(file)) {
    await fs.remove(file);
  }

  return true;
}

// Database তথ্য
export async function getDatabaseInfo() {
  await fs.ensureDir(DB_DIR);

  const files = await fs.readdir(DB_DIR);

  return {
    directory: DB_DIR,
    files,
    count: files.length
  };
}
