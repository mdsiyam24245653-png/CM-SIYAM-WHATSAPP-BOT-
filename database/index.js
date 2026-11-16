// AUTHOR: 𝐑𝐉 𝐬𝐢𝐲𝐚𝐦

import fs from "fs-extra";
import path from "path";

import { CONFIG } from "../config.js";

const DB_DIR = process.env.DATABASE_DIR || CONFIG?.DATABASE_DIR || "./database";

await fs.ensureDir(DB_DIR);

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

export async function deleteData(name) {
  const file = path.join(DB_DIR, `${name}.json`);

  if (await fs.pathExists(file)) {
    await fs.remove(file);
  }

  return true;
}

export async function getDatabaseInfo() {
  const files = await fs.readdir(DB_DIR);

  return {
    directory: DB_DIR,
    files,
    count: files.length
  };
}

