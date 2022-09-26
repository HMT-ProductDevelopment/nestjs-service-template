export class Response<T> {
    status: boolean
    code: string
    message: string
    data: T
}

export class Authen {
    userId: string
    email: string
    name: string
}

export class AuthenResponse extends Response<Authen> {

}