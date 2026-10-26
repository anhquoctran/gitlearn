export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details?: unknown
  ) {
    super(message);
    this.name = "HttpError";
  }
}

interface BodyParserError extends Error {
  type?: string;
}

interface ErrorResponse {
  status: number;
  body: {
    error: {
      code: string;
      message: string;
      details?: unknown;
      requestId: string;
    };
  };
}

export function toErrorResponse(error: unknown, requestId: string): ErrorResponse {
  if (error instanceof HttpError) {
    return {
      status: error.status,
      body: {
        error: {
          code: error.code,
          message: error.message,
          ...(error.details === undefined ? {} : { details: error.details }),
          requestId
        }
      }
    };
  }

  const parserError = error as BodyParserError | null;
  if (parserError?.type === "entity.too.large") {
    return {
      status: 413,
      body: {
        error: {
          code: "BODY_TOO_LARGE",
          message: "Request body exceeds 1 MiB.",
          requestId
        }
      }
    };
  }

  if (parserError?.type === "entity.parse.failed") {
    return {
      status: 400,
      body: {
        error: {
          code: "INVALID_JSON",
          message: "Request body must contain valid JSON.",
          requestId
        }
      }
    };
  }

  return {
    status: 500,
    body: {
      error: {
        code: "INTERNAL_ERROR",
        message: "The request could not be completed.",
        requestId
      }
    }
  };
}
