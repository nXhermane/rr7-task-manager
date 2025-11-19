export enum AppErrorCode {
    BAD_REQUEST = "Bad Request",    
    UNAUTHORIZED = "Unauthorized",
    FORBIDDEN = "Forbidden",
    NOT_FOUND = "Not Found",
    CONFLICT =   "Conflict",
    INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
};

export const mapErrorCodeToStatus = (code: AppErrorCode) => {
    switch (code) {
        case AppErrorCode.BAD_REQUEST:
            return 400;
        case AppErrorCode.UNAUTHORIZED:
            return 401;
        case AppErrorCode.FORBIDDEN:
            return 403;
        case AppErrorCode.NOT_FOUND:
            return 404;
        case AppErrorCode.CONFLICT:
            return 409;
        case AppErrorCode.INTERNAL_SERVER_ERROR:
            return 500;
        default:
            return 500;
    }
};

export class AppError extends Error {
    private _code: AppErrorCode;
    constructor(message: string,code: AppErrorCode) {
        super(message);
        this.name = "AppError";
        this._code = code;
    }
    public get code () {
        return this._code;
    }
}
export class BadRequestError extends AppError {
    constructor(message: string) {
        super(message,AppErrorCode.BAD_REQUEST);
    }
}
export class UnauthorizedError extends AppError {
    constructor(message: string) {
        super(message,AppErrorCode.UNAUTHORIZED);
    }
}
export class ForbiddenError extends AppError {
    constructor(message: string) {
        super(message,AppErrorCode.FORBIDDEN);
    }
}
export class NotFoundError extends AppError {
    constructor(message: string) {
        super(message,AppErrorCode.NOT_FOUND);
    }
}
export class ConflictError extends AppError {
    constructor(message: string) {
        super(message,AppErrorCode.CONFLICT);
    }
}
export class InternalServerError extends AppError {
    constructor(message: string) {
        super(message,AppErrorCode.BAD_REQUEST);
    }
}


export function handleError(error: unknown) {
    if (error instanceof AppError) {
        return {
            code: mapErrorCodeToStatus(error.code),
            message: error.message,
        };
    }
    return {
        code: mapErrorCodeToStatus(AppErrorCode.INTERNAL_SERVER_ERROR),
        message: "Internal Server Error",
    };
}
