class AppError {
    public readonly message: string;
  
    public readonly statusCode: number;
  
    public readonly err: number;
  
    constructor(message: string, statusCode: number, err: any = null) {
      this.message = message;
      this.statusCode = statusCode;
      this.err = err;
    }
  }
  
  export default AppError;