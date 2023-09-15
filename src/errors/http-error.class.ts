export class HTTPError extends Error {
  statusCode: number;
  contex?: string;

  constructor(statusCode: number, message: string, contex?: string) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.contex = contex;
  }
}
