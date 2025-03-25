// import ConfirmDialog from "@/components/confirm-dialog";
import SortableItem from "@/components/dnd/drag-and-drop-item";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
// import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
// import { useRef} from "react";
import { v7 } from "uuid";

// function ArrayItem({
//   itemId,
//   itemGivenName,
//   labels,
//   values,
//   handleTextareaChange,
//   handleDeleteItem,
// }: {
//   itemId: string;
//   itemGivenName?: string;
//   labels: string[];
//   values: string[];
//   handleTextareaChange: (id: string, label: number, value: string) => void;
//   handleDeleteItem: (itemId: string) => void;
// }) {
//   const [itemName, setItemName] = useState(`${itemGivenName ?? itemId}`);
//
//   const [isEditName, setIsEditName] = useState(false);
//
//   const itemNameInputRef = useRef<HTMLInputElement>(null);
//
//   const itemIdNumber = itemId.split("-").slice(1).join("-");
//
//   return (
//     <SortableItem itemId={itemId}>
//       <Dialog>
//         <DialogTrigger asChild>
//           <div className="flex w-full h-8 pr-2 gap-2 overflow-hidden justify-between items-center hover:bg-accent">
//             <div className="truncate">{itemName}</div>
//             <Badge className="mr-1">View</Badge>
//           </div>
//         </DialogTrigger>
//         <DialogContent
//           className="w-[800px] max-w-[800px] h-[540px] flex flex-col"
//           onEscapeKeyDown={(e) => {
//             if (isEditName) {
//               e.preventDefault();
//             }
//           }}
//         >
//           <DialogHeader>
//             <DialogTitle>
//               {isEditName ? (
//                 <Input
//                   ref={itemNameInputRef}
//                   value={itemName}
//                   onChange={(e) => {
//                     setItemName(e.target.value);
//                   }}
//                   onBlur={() => setIsEditName(false)}
//                   onKeyDown={(e: React.KeyboardEvent) => {
//                     if (e.key === "Enter" || e.key === "Escape")
//                       setIsEditName(false);
//                   }}
//                   className="basis-4/5"
//                 />
//               ) : (
//                 <div
//                   onClick={() => {
//                     setIsEditName(true);
//                     setTimeout(() => itemNameInputRef.current?.focus(), 0);
//                   }}
//                   className="basis-4/5 text-2xl font-semibold p-1 w-full text-wrap hover:bg-accent"
//                 >
//                   {itemName}
//                 </div>
//               )}
//             </DialogTitle>
//             <DialogDescription>
//               Provide your detail information to help create you desire prompt
//             </DialogDescription>
//           </DialogHeader>
//
//           <ScrollArea className="h-full w-full">
//             {values.length ? (
//               <div className="flex flex-col gap-6 p-2">
//                 {values.map((value, index) => (
//                   <div
//                     key={`Card-${itemId}-${labels[index]}`}
//                     className="w-full flex flex-row justify-start items-center"
//                   >
//                     <div className="text-xl font-semibold basis-1/5">
//                       {labels[index][0].toUpperCase()}
//                       {labels[index].slice(1)}:
//                     </div>
//                     <Textarea
//                       placeholder={labels[index]}
//                       className="min-h-[100px] basis-4/5 border border-slate-500"
//                       value={value}
//                       onChange={(e) => {
//                         handleTextareaChange(itemId, index, e.target.value);
//                       }}
//                     ></Textarea>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="flex flex-col mt-2 items-center">
//                 This config has no keys
//               </div>
//             )}
//           </ScrollArea>
//
//           <DialogFooter>
//             <div className="flex w-full justify-start">
//               <ConfirmDialog
//                 variant="outline"
//                 className="text-red-500 border-red-500 hover:text-red-400 focus:text-red-400"
//                 action={() => {
//                   handleDeleteItem(itemIdNumber.toString());
//                 }}
//                 description="This action will delete this item"
//               >
//                 Delete
//               </ConfirmDialog>
//             </div>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </SortableItem>
//   );
// }

function ArrayAccordionItem({
  itemId,
  itemGivenName,
  labels,
  values,
  handleTextareaChange,
  // handleDeleteItem,
}: {
  itemId: string;
  itemGivenName?: string;
  labels: string[];
  values: string[];
  handleTextareaChange: (id: string, label: number, value: string) => void;
  handleDeleteItem: (itemId: string) => void;
}) {
  const [itemName, setItemName] = useState(`${itemGivenName ?? itemId}`);

  console.log(setItemName);

  // const [isEditName, setIsEditName] = useState(false);
  //
  // const itemNameInputRef = useRef<HTMLInputElement>(null);

  // const itemIdNumber = itemId.split("-").slice(1).join("-");

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <SortableItem itemId={itemId}>
          <AccordionTrigger className="pr-2">
            <div className="flex w-full text-wrap h-8 pr-2 gap-2 overflow-hidden justify-between items-center truncate hover:bg-accent">
              {itemName}
            </div>
          </AccordionTrigger>
        </SortableItem>
        <AccordionContent>
          <ScrollArea className="h-full w-full">
            {values.length ? (
              <div className="flex flex-col gap-6 p-2">
                {values.map((value, index) => (
                  <div
                    key={`Card-${itemId}-${labels[index]}`}
                    className="w-full flex flex-col justify-start"
                  >
                    <div className="text-xl font-semibold">
                      {labels[index][0].toUpperCase()}
                      {labels[index].slice(1)}:
                    </div>
                    <Textarea
                      placeholder={labels[index]}
                      className="w-full border border-slate-500"
                      value={value}
                      onChange={(e) => {
                        handleTextareaChange(itemId, index, e.target.value);
                      }}
                    ></Textarea>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col mt-2 items-center">
                This config has no keys
              </div>
            )}
          </ScrollArea>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

interface ArrayConfigProps {
  id: string;
  labels: string[];
  values: { id: string; values: string[] }[];
  setArrayValues: Dispatch<
    SetStateAction<Record<string, { id: string; values: string[] }[]>>
  >;
}

export function ArrayConfig({
  id,
  labels,
  values,
  setArrayValues,
}: ArrayConfigProps) {
  const handleAddItems = () => {
    setArrayValues((prevState) => ({
      ...prevState,
      [id]: [
        ...(prevState[id] ?? []),
        {
          id: v7(),
          values: labels.map((label) => `${label}`),
        },
      ],
    }));
  };

  const sortableItems = values
    ? values.map((pack) => ({
        id: `${id}-${pack.id}`,
        data: pack.values,
      }))
    : [];

  const handleTextareaChange = (
    itemId: string,
    labelIndex: number,
    value: string,
  ) => {
    setArrayValues((prevState) => {
      const newArray = (prevState[id] ?? []).map((item) => {
        if (item.id === itemId.split("-").slice(1).join("-")) {
          const newValues = item.values;
          newValues[labelIndex] = value;

          return {
            id: item.id,
            values: newValues,
          };
        } else {
          return {
            ...item,
          };
        }
      });

      return {
        ...prevState,
        [id]: newArray,
      };
    });
  };

  const handleDeleteItem = (itemId: string) => {
    setArrayValues((prevState) => {
      const newArray = prevState[id].filter((item) => item.id !== itemId);

      return {
        ...prevState,
        [id]: newArray,
      };
    });
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active || !over) return;
    if (active.id !== over.id) {
      setArrayValues((prev) => {
        const newOrder = [...prev[id]];
        const oldIndex = newOrder.findIndex(
          (value) => `${id}-${value.id}` === active.id,
        );
        const newIndex = newOrder.findIndex(
          (value) => `${id}-${value.id}` === over.id,
        );

        if (oldIndex !== -1 && newIndex !== -1) {
          const [movedItem] = newOrder.splice(oldIndex, 1);
          newOrder.splice(newIndex, 0, movedItem);
        }

        return { ...prev, [id]: newOrder };
      });
    }
  };

  return (
    <>
      <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext
          items={sortableItems.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {sortableItems.length ? (
              sortableItems.map((item) => (
                <ArrayAccordionItem
                  key={item.id}
                  itemId={item.id}
                  labels={labels}
                  values={item.data}
                  handleTextareaChange={handleTextareaChange}
                  handleDeleteItem={handleDeleteItem}
                ></ArrayAccordionItem>
              ))
            ) : (
              <div className="text-center my-2 text-muted-foreground">
                Empty
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>

      <div className="flex justify-end mr-2">
        <Button variant="ghost" onClick={handleAddItems}>
          <Plus></Plus>
        </Button>
      </div>
    </>
  );
}
