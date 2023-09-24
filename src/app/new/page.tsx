import { redirect } from "next/navigation";
import fs from "node:fs/promises";
import path from "node:path";
import invariant from "tiny-invariant";
import { v4 as uuidv4 } from "uuid";

import { Container } from "@/components/container";
import { RenderingForm } from "@/components/rendering-form";
import { Rendering } from "@/models/rendering";

async function create(formData: FormData) {
  "use server";
  const id = uuidv4();
  const renderingPath = path.join(process.cwd(), "data/renderings", id);

  const thumbnail = formData.get("thumbnail") as File;
  const cameras = formData.get("cameras") as File;
  const images = formData.get("images") as File;
  const bundle = formData.get("bundle") as File;

  const files = [
    { name: "thumbnail.jpg", file: thumbnail },
    { name: "cameras.txt", file: cameras },
    { name: "images.txt", file: images },
    { name: "bundlename", file: bundle },
  ];

  function toNumber(value: unknown) {
    invariant(typeof value === "string", "Expected a string");
    return parseInt(value, 10);
  }

  const depthCorrectionFactor = toNumber(
    formData.get("depthCorrectionFactor")?.valueOf(),
  );
  const scaleX = toNumber(formData.get("scaleX")?.valueOf());
  const scaleY = toNumber(formData.get("scaleY")?.valueOf());
  const scaleZ = toNumber(formData.get("scaleZ")?.valueOf());
  const params = {
    depthCorrectionFactor,
    scaleX,
    scaleY,
    scaleZ,
  };

  try {
    await fs.access(renderingPath);
  } catch (e) {
    const err = e as { code?: string } | undefined;
    if (err?.code === "ENOENT") {
      await fs.mkdir(renderingPath, { recursive: true });
    }
  }

  await Promise.all([
    ...files.map(async ({ name, file }) => {
      const filePath = path.join(renderingPath, name);
      await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));
    }),
    fs.writeFile(
      path.join(renderingPath, "params.json"),
      JSON.stringify(params),
      { encoding: "utf-8" },
    ),
    fs.writeFile(
      path.join(renderingPath, "additional_information.txt"),
      `# Additional setup information:
#   INITIAL_VIEWING_POSITION
0 0 0
#   Distance ranges with one line of data per camera:
#   CAMERA_ID DISTANCE_RANGE_MIN DISTANCE_RANGE_MAX
1 0.3 1000`,
      { encoding: "utf-8" },
    ),
  ]);

  await Rendering.add(id);

  redirect("/?alert=created");
}

export default async function NewRendering() {
  return (
    <Container title="New Rendering" buttons={null}>
      <RenderingForm onSubmit={create} />
    </Container>
  );
}
