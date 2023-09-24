/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

export function RenderingThumbnail({
  link,
  id,
}: {
  link?: boolean;
  id: string;
}) {
  return (
    <div className="group aspect-square block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
      <img
        src={`/renderings/${id}/thumbnail.jpg`}
        alt=""
        className={`w-full pointer-events-none object-cover${
          link ? " group-hover:opacity-75" : ""
        }`}
      />
      {link ? (
        <Link className="absolute inset-0 focus:outline-none" href={id}>
          <span className="sr-only">View details</span>
        </Link>
      ) : null}
    </div>
  );
}
