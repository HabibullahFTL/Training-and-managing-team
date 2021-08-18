import React, { useContext, useEffect } from "react";
import { useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import {
  DragDropContext,
  Draggable,
  Droppable,
} from "react-beautiful-dnd";
// import profile1 from "../../Assets/images/profile1.jpg";
// import profile2 from "../../Assets/images/profile2.jpg";
// import profile3 from "../../Assets/images/profile3.jpg";
// import profile4 from "../../Assets/images/profile4.jpg";
// import profile5 from "../../Assets/images/profile5.jpg";

// import { v4 as uuidv4 } from "uuid";

// const itemsFromBackend = [
//   {
//     id: uuidv4(),
//     content: "Add picture & write similar words for web app",
//     date: "Aug 11",
//     img: profile1,
//   },
//   {
//     id: uuidv4(),
//     content: "Implementing review feature on dashboard",
//     date: "Aug 11",
//     img: profile2,
//   },
//   {
//     id: uuidv4(),
//     content: "Connect web app with database",
//     date: "Aug 11",
//     img: profile3,
//   },
//   {
//     id: uuidv4(),
//     content: "Add unit testing on implemented features",
//     date: "Aug 11",
//     img: profile4,
//   },
//   {
//     id: uuidv4(),
//     content: "Add relevant footer section",
//     date: "Aug 11",
//     img: profile5,
//   },
// ];

// const columnsFromBackend = {
//   [uuidv4()]: {
//     name: "TO DO",
//     items: itemsFromBackend,
//   },
//   [uuidv4()]: {
//     name: "IN PROGRESS",
//     items: [],
//   },
//   [uuidv4()]: {
//     name: "DONE",
//     items: [],
//   },
//   [uuidv4()]: {
//     name: "DEPLOYED",
//     items: [],
//   },
// };
import { UserDataContext } from '../../Contexts/UserDataContext';

export const db = firebase.firestore();

type TaskBoard = {
  taskName: string,
  teamName: string,
  taskDescription: string
};

const TaskBoard = () => {
  const [taskCard, setTaskCard] = useState([]);
  const { userData, setUserData } = useContext(UserDataContext);

  useEffect(() => {
    db.collection("task_list")
      .where("co_id", "==", userData.co_id)
      .get()
      .then((task_list: any) => {
        let allTaskCard = task_list.docs.map((doc: any) => doc.data());
        setTaskCard(allTaskCard);
        console.log(allTaskCard)
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }, [userData.co_id]);

  const onDragEnd = (result: any, taskCard: any, setTaskCard: any) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = taskCard[source.droppableId];
      const destColumn = taskCard[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setTaskCard({
        ...taskCard,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
    } else {
      const column = taskCard[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setTaskCard({
        ...taskCard,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    }
  };

  return (
    <>
      <h3 className="text-center text-3xl font-bold p-2">TaskBoard</h3>
      <div
        style={{ display: "flex", justifyContent: "center", height: "auto" }}
      >
        <DragDropContext
          onDragEnd={(result) => onDragEnd(result, taskCard, setTaskCard)}
        >
          {Object.entries(taskCard).map(([columnId, column]: any, index) => {
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
                key={columnId}
              >
                <h3 className="text-sm font-semibold bg-gray-300 px-20 rounded text-blue-400">
                  {column.name}
                </h3>
                <div style={{ margin: 7 }}>
                  <Droppable droppableId={columnId} key={columnId}>
                    {(provided, snapshot) => {
                      return (
                        <div
                          className="rounded"
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={{
                            background: snapshot.isDraggingOver
                              ? "lightblue"
                              : "#d1d5db",
                            padding: 7,
                            width: 250,
                            minHeight: 90,
                          }}
                        >
                          {taskCard.map((item: any, index: any) => {
                            return (
                              <Draggable
                                key={item.co_id}
                                draggableId={item.co_id}
                                index={index}
                              >
                                {(provided, snapshot) => {
                                  return (
                                    <div
                                      className="rounded-md shadow-sm"
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        userSelect: "none",
                                        padding: 10,
                                        margin: "0 0 8px 0",
                                        minHeight: "30px",
                                        backgroundColor: snapshot.isDragging
                                          ? "lightgray"
                                          : "white",
                                        ...provided.draggableProps.style,
                                      }}
                                    >
                                      <div>
                                        <p className="text-sm font-medium text-gray-900">
                                          {item.taskName}
                                        </p>
                                      </div>
                                      <div className="flex justify-between pt-3">
                                        <p className="text-sm font-medium text-gray-500">
                                          {item.teamName}
                                        </p>
                                        <span>
                                          <img
                                            src={item.img}
                                            alt="profile-pic"
                                            className="h-6 w-6 rounded-full"
                                          />
                                        </span>
                                      </div>
                                    </div>
                                  );
                                }}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      );
                    }}
                  </Droppable>
                </div>
              </div>
            );
          })}
        </DragDropContext>
      </div>
    </>
  );
};

export default TaskBoard;