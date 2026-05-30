export function ErrorHandling(error:unknown) {
    // 1. Determine the error message safely
    let errorMessage = 'An unexpected error occurred';
    const status = 500;

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }


    return {status, errorMessage}
}