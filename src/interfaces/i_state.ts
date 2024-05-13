export interface State{
    ID:string,
    stateName:string,
    position?:number,
    taskArray?: {taskName: string}[],
    delete?: boolean
}