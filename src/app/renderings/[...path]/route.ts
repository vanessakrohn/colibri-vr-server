import fs from "node:fs/promises";
import path from "node:path";

import { Rendering } from "@/models/rendering";

export async function GET(
  _: Request,
  { params }: { params: { path: string[] } },
) {
  try {
    const file = path.join(process.cwd(), "data/renderings", ...params.path);
    const content = await fs.readFile(file);
    return new Response(content);
  } catch (e) {
    return new Response("Not found", { status: 404 });
  }
}
