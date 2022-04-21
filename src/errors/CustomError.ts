export type CustomErrorType = {
  message: string;
  status: number;
}

export default class CustomError extends Error {
  public status: number = 400;

  constructor({ message, status }: CustomErrorType) {
    super(JSON.stringify({ error: { status, message } }));
    this.status = status;
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}