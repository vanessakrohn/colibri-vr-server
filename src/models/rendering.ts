import fs from "node:fs/promises";
import path from "node:path";

const file = path.join(process.cwd(), "data/renderings.json");

export class Rendering {
  static async getAll(): Promise<string[]> {
    try {
      const content = await fs.readFile(file, { encoding: "utf-8" });
      return JSON.parse(content);
    } catch (e) {
      const err = e as { code?: "ENOENT" };
      if (err.code !== "ENOENT") throw e;
      return [];
    }
  }

  static async setAll(ids: string[]) {
    const content = JSON.stringify(ids);
    await fs.writeFile(file, content, { encoding: "utf-8" });
  }

  static async add(id: string) {
    const ids = await this.getAll();
    await this.setAll([...ids, id]);
  }

  static async remove(id: string) {
    const ids = await this.getAll();
    await this.setAll(ids.filter((i) => i !== id));
  }
}
