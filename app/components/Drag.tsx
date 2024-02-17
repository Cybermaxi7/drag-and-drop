"use client";

import React, { useEffect, useState } from "react";
import {
    DragDropContext,
    Draggable,
    DropResult,
    Droppable,
} from "react-beautiful-dnd";
import { cardsData } from "../data/Data";

interface Data {
    id: number;
    title: string;
    components: {
        id: number;
        name: string;
    }[];
}

export default function Drag() {
    const [data, setData] = useState<Data[] | []>([]);
    useEffect(function () {
        setData(cardsData);
    }, []);
    function onDragEnd(e: DropResult) {
        const { source, destination } = e;
        if (!destination) return;
        if (source.droppableId === destination?.droppableId) {
            const newData = JSON.parse(JSON.stringify(data));
            const index = parseInt(source.droppableId.split("droppable")[1]);
            const el = newData[index].components.splice(source.index);
            newData[index].components.splice(destination.index, 0, ...el);
            setData(newData);
        } else {
            const newData = JSON.parse(JSON.stringify(data));
            const oldIndex = parseInt(source.droppableId.split("droppable")[1]);
            const newIndex = parseInt(
                destination.droppableId.split("droppable")[1]
            );
            const el = newData[oldIndex].components.splice(source.index, 1);
            newData[newIndex].components.splice(source.index, 0, ...el);
            setData(newData);
        }
    }
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div>
                <h1 className="text-center my-10 font-bold text-black text-xl">
                    Drag and Drop Application
                </h1>
                <div
                    className="absolute inset-x-0 top-0 bg-red-500 -z-10"
                    style={{
                        clipPath: "polygon(0 0, 100% 0, 100% 80%, 0 100%)",
                        height: "60%",
                    }}
                ></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 my-10 mx-5 gap-5 z-10">
                    {data.length &&
                        data.map((data, index) => (
                            <Droppable
                                key={data.id}
                                droppableId={`droppable${data.id}`}
                            >
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="border-gray-400 border border-dashed w-full "
                                    >
                                        <h2 className="text-center">
                                            {data.title}
                                        </h2>
                                        {data.components.map(
                                            (component, index) => (
                                                <Draggable
                                                    key={component.id}
                                                    draggableId={`draggable${component.id}`}
                                                    index={index}
                                                >
                                                    {(provided) => (
                                                        <div
                                                            {...provided.dragHandleProps}
                                                            {...provided.draggableProps}
                                                            ref={
                                                                provided.innerRef
                                                            }
                                                            className="m-4 p-4 border rounded-lg bg-gray-300"
                                                        >
                                                            {component.name}
                                                        </div>
                                                    )}
                                                </Draggable>
                                            )
                                        )}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        ))}
                </div>
            </div>
        </DragDropContext>
    );
}
