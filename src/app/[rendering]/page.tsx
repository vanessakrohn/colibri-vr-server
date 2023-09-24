import { redirect } from "next/navigation";
import fs from "node:fs/promises";
import path from "node:path";

import { Container } from "@/components/container";
import { RenderingThumbnail } from "@/components/rendering-thumbnail";
import { Rendering } from "@/models/rendering";

async function remove(id: string) {
  "use server";
  await fs.rm(path.join(process.cwd(), "data/renderings", id), {
    recursive: true,
    force: true,
  });
  await Rendering.remove(id);
  redirect("/?alert=removed");
}

export default function RenderingPage({
  params,
}: {
  params: { rendering: string };
}) {
  return (
    <Container
      title="Rendering"
      buttons={
        <form
          action={async () => {
            "use server";
            await remove(params.rendering);
          }}
        >
          <button
            type="submit"
            className="ml-3 inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            Delete
          </button>
        </form>
      }
    >
      <div className="w-96">
        <RenderingThumbnail id={params.rendering} />
      </div>
    </Container>
  );
}
