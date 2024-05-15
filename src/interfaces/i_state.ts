export interface State{
    id:string,
    stateName:string,
    position?:number,
    taskArray?: {taskName: string}[],
    delete?: boolean
}