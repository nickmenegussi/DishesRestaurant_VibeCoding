
export class AppError extends Error {
    public statusCode: number;
    public status: string;
    public isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        if (typeof (Error as any).captureStackTrace === 'function') {
            (Error as any).captureStackTrace(this, this.constructor);
        }
    }
}

export const handleError = (error: unknown) => {
    if (error instanceof AppError) {
        return { error: error.message, status: error.statusCode };
    }
    console.error('Unexpected Error:', error);
    return { error: 'Something went wrong', status: 500 };
};
