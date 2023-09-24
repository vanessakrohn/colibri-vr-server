import { Rendering } from "@/models/rendering";

export async function GET(request: Request) {
  const origin = process.env.ORIGIN;
  const ids = await Rendering.getAll();
  const renderings = ids.map((id) => {
    return `${origin}/renderings/${id}/`;
  });
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);
  const repeat = parseInt(params.get("repeat") ?? "1", 10);
  const output = [];
  for (let i = 0; i < repeat; i++) {
    output.push(...renderings);
  }
  return new Response(JSON.stringify({ renderings: output }), {
    headers: { "content-type": "application/json" },
  });
}
