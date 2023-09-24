"use client";

import PhotoIcon from "@heroicons/react/24/outline/PhotoIcon";
import { useRouter } from "next/navigation";
import { ReactNode, useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";

export function RenderingForm({
  onSubmit,
}: {
  onSubmit(formData: FormData): Promise<void>;
}) {
  const router = useRouter();
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const avatarEditor = useRef<AvatarEditor>(null);

  return (
    <form
      action={async (formData) => {
        const dataUrl = avatarEditor.current
          ?.getImageScaledToCanvas()
          .toDataURL();
        if (!dataUrl) return;
        const result = await fetch(dataUrl);
        const blob = await result.blob();
        const file = new File([blob], "thumbnail.jpg");
        formData.set("thumbnail", file);
        await onSubmit(formData);
      }}
    >
      <div className="space-y-12">
        <FormSection title="Thumbnail">
          <div className="sm:col-span-2 sm:col-start-1">
            <div className="col-span-full">
              <div
                style={{
                  width: "500px",
                }}
              >
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600 sm:max-w-md">
                    <input
                      type="file"
                      name="thumbnail"
                      id="thumbnail"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (!file) return;
                        setThumbnail(file);
                      }}
                      required
                      className="block flex-1 border-0 bg-transparent px-2 py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="mt-2 flex flex-col aspect-square items-center justify-center rounded-lg border border-dashed border-gray-900/25">
                  {thumbnail ? (
                    <AvatarEditor
                      ref={avatarEditor}
                      image={thumbnail}
                      width={400}
                      height={400}
                      border={50}
                      color={[255, 255, 255, 0.6]} // RGBA
                      scale={1.2}
                      rotate={0}
                    />
                  ) : (
                    <div className="flex flex-col items-center">
                      <PhotoIcon
                        className="mx-auto h-12 w-12 text-gray-300"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </FormSection>
        <FormSection title="COLMAP Model">
          <div className="sm:col-span-2 sm:col-start-1">
            <FileInput id="cameras" label="cameras.txt" />
          </div>
          <div className="sm:col-span-2">
            <FileInput id="images" label="images.txt" />
          </div>
        </FormSection>
        <FormSection title="AssetBundle">
          <div className="sm:col-span-2 sm:col-start-1">
            <FileInput id="bundle" label="bundlename" />
          </div>
        </FormSection>
        <FormSection title="Parameters">
          <div className="sm:col-span-2 sm:col-start-1">
            <NumberInput
              id="depthCorrectionFactor"
              label="Depth Correction Factor"
            />
          </div>

          <div className="sm:col-span-2 sm:col-start-1">
            <NumberInput id="scaleX" label="Scale X" />
          </div>

          <div className="sm:col-span-2">
            <NumberInput id="scaleY" label="Scale Y" />
          </div>

          <div className="sm:col-span-2">
            <NumberInput id="scaleZ" label="Scale Z" />
          </div>
        </FormSection>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
          onClick={() => {
            router.back();
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Save
        </button>
      </div>
    </form>
  );
}

function NumberInput({ id, label }: { id: string; label: string }) {
  return (
    <>
      <label
        htmlFor={id}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
      <div className="mt-2">
        <input
          type="number"
          name={id}
          id={id}
          defaultValue={1}
          required
          className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>
    </>
  );
}

function FileInput({
  id,
  label,
  description,
  multiple,
}: {
  id: string;
  label: string;
  description?: string;
  multiple?: boolean;
}) {
  return (
    <>
      <label
        htmlFor={id}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
      {description ? (
        <p className="mt-1 text-sm leading-6 text-gray-600">{description}</p>
      ) : null}
      <div className="mt-2">
        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600 sm:max-w-md">
          <input
            type="file"
            name={id}
            id={id}
            multiple={multiple}
            required
            className="block flex-1 border-0 bg-transparent px-2 py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
    </>
  );
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="border-b border-gray-900/10 pb-12">
      <h2 className="text-base font-semibold leading-7 text-gray-900">
        {title}
      </h2>
      {description ? (
        <p className="mt-1 text-sm leading-6 text-gray-600">{description}</p>
      ) : null}

      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        {children}
      </div>
    </div>
  );
}
