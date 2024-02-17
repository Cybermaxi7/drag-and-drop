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
            const newData = JSON.parse(JSON.stringify(data))
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
                <div className="flex justify-between my-10 mx-5 gap-5">
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
                                        className="border-gray-400 border border-dashed w-1/3"
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
                                                            className="m-4 p-4 border bg-gray-300"
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
