import { Renderings } from "@/components/renderings";
import { Rendering } from "@/models/rendering";

async function setRenderings(ids: string[]) {
  "use server";
  await Rendering.setAll(ids);
}

export default async function Home() {
  const ids = await Rendering.getAll();
  return <Renderings ids={ids} onSave={setRenderings} />;
}
