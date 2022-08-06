export class ApiError extends Error {
  status: number;
  errors: any[];

  constructor(status: number, message: string, errors: any[]) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static Unathorized() {
    return new ApiError(401, 'Unauthorized', []);
  }

  static BadRequest(errors: any[]) {
    return new ApiError(400, 'Bad Request', errors);
  }

  static NotFound(errors: any[]) {
    return new ApiError(404, 'Not Found', errors);
  }
}
