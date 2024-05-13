export interface Task{
    taskID:string,
    taskTitle:string,
    taskDescription?:string,
    hoursExpected?:number,
    hoursSpent?:number,
    labelColor?:string,
    labelText?:string,
    parentTaskID?:number,
    assignedToID?:string[],
    createdByID:string
}