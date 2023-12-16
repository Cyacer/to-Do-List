export interface User{
    email: string,
    username:string,
    password:string
    }

export interface Login{
    id: number,
    email: string,
    password: string | null 
}