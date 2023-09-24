import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import invariant from "tiny-invariant";

import { RenderingThumbnail } from "../rendering-thumbnail";

export function SortableRenderings({
  value,
  onChange,
}: {
  value: string[];
  onChange: (set: (value: string[]) => string[]) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={value}>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
          {value.map((item) => (
            <SortableItem key={item} id={item} />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    const activeId = active.id;
    const overId = over?.id;
    invariant(
      typeof activeId === "string",
      "Expected active.id to be a string",
    );
    invariant(typeof overId === "string", "Expected over.id to be a string");

    if (activeId !== overId) {
      onChange((items) => {
        const oldIndex = items.indexOf(activeId);
        const newIndex = items.indexOf(overId);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }
}

function SortableItem(props: { id: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      className="relative"
      style={style}
      {...attributes}
      {...listeners}
    >
      <RenderingThumbnail id={props.id} />
    </li>
  );
}
