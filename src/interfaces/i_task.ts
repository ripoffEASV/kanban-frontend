export interface Task{
    taskID:number,
    taskTitle:string,
    taskDescription?:string,
    hoursExpected?:number,
    hoursSpent?:number,
    labelColor?:string,
    labelText?:string,
    parentTaskID?:number,
    assignedToID?:number[],
    createdByID:number
}