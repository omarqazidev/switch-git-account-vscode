
export function logError(error: unknown): void {
    let message: string;

    if (error instanceof Error) {
        message = error.message;
    } else {
        message = String(error);
    }

    console.error('Error occurred:', message);
}