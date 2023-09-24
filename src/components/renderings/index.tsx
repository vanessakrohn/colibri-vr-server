"use client";

import CheckCircleIcon from "@heroicons/react/24/solid/CheckCircleIcon";
import PlusSmallIcon from "@heroicons/react/24/outline/PlusSmallIcon";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useReducer } from "react";

import { Container } from "../container";
import { SortableRenderings } from "./sortable";
import { RenderingThumbnail } from "../rendering-thumbnail";

interface State {
  sortable: boolean;
  value: string[];
  initialValue: string[];
}

type Action =
  | { type: "set-value"; payload: string[] }
  | { type: "cancel" }
  | { type: "save" }
  | { type: "sort" };

function reducer(state: State, action: Action) {
  switch (action.type) {
    case "set-value":
      return {
        ...state,
        value: action.payload,
      };
    case "cancel":
      return {
        ...state,
        sortable: false,
        value: state.initialValue,
      };
    case "save":
      return {
        ...state,
        sortable: false,
        initialValue: state.value,
      };
    case "sort":
      return {
        ...state,
        sortable: true,
      };
  }
}

export function Renderings({
  ids,
  onSave,
}: {
  ids: string[];
  onSave(ids: string[]): Promise<void>;
}) {
  const [state, dispatch] = useReducer(reducer, {
    sortable: false,
    value: ids,
    initialValue: ids,
  });
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function renderButtons() {
    if (state.sortable) {
      return (
        <>
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            onClick={() => {
              dispatch({ type: "cancel" });
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            className="ml-3 inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            onClick={() => {
              onSave(state.value);
              router.replace(`${pathname}?alert=sorted`);
              dispatch({ type: "save" });
            }}
          >
            Save
          </button>
        </>
      );
    }

    return (
      <button
        type="button"
        className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        onClick={() => {
          router.replace(pathname);
          dispatch({ type: "sort" });
        }}
      >
        Sort
      </button>
    );
  }

  function renderAlert() {
    const type = searchParams.get("alert");

    function getMessage() {
      switch (type) {
        case "created":
          return "Successfully created";
        case "removed":
          return "Successfully deleted";
        case "sorted":
          return "Successfully sorted";
        default:
          return null;
      }
    }

    const message = getMessage();
    if (!message) return null;

    return (
      <div className="rounded-md bg-green-50 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <CheckCircleIcon
              className="h-5 w-5 text-green-400"
              aria-hidden="true"
            />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-green-800">{message}</p>
          </div>
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                className="inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
                onClick={() => {
                  router.replace(pathname, {});
                }}
              >
                <span className="sr-only">Dismiss</span>
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderChildren() {
    if (state.sortable) {
      return (
        <SortableRenderings
          value={state.value}
          onChange={(f) => {
            dispatch({ type: "set-value", payload: f(state.value) });
          }}
        />
      );
    }

    return (
      <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
        {state.initialValue.map((id) => (
          <li key={id} className="relative">
            <RenderingThumbnail id={id} link />
          </li>
        ))}
        <li className="relative">
          <div className="group aspect-square block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
            <PlusSmallIcon className="pointer-events-none object-cover group-hover:opacity-75" />
            <Link className="absolute inset-0 focus:outline-none" href="new">
              <span className="sr-only">New rendering</span>
            </Link>
          </div>
        </li>
      </ul>
    );
  }

  return (
    <Container title="Renderings" buttons={renderButtons()}>
      {renderAlert()}
      {renderChildren()}
    </Container>
  );
}
