namespace SchoolManagementApi.DTOs.Common;

public class Result<T> where T : class
{
    public bool IsSuccess { get; set; }
    public string Message { get; set; } = null!;
    public int StatusCode { get; set; }
    public T? Value { get; set; }

    public Result(bool isSuccess, string message, int statusCode, T? value = null)
    {
        IsSuccess = isSuccess;
        Message = message;
        StatusCode = statusCode;
        Value = value;
    }

    public static Result<T> Success(T value, string message = "Operación exitosa", int statusCode = 200)
    {
        return new Result<T>(true, message, statusCode, value);
    }

    public static Result<T> SuccessEmpty(string message = "Operación exitosa", int statusCode = 200)
    {
        return new Result<T>(true, message, statusCode, null);
    }

    public static Result<T> Failure(string message, int statusCode = 400)
    {
        return new Result<T>(false, message, statusCode, null);
    }
}

public class Result
{
    public bool IsSuccess { get; set; }
    public string Message { get; set; } = null!;
    public int StatusCode { get; set; }
    public object? Value { get; set; }

    public Result(bool isSuccess, string message, int statusCode, object? value = null)
    {
        IsSuccess = isSuccess;
        Message = message;
        StatusCode = statusCode;
        Value = value;
    }

    public static Result Success(object? value, string message = "Operación exitosa", int statusCode = 400)
         => new Result(true, message, statusCode, value);

    public static Result SuccessEmpty(string message = "Operación exitosa", int statusCode = 400)
        => new Result(true, message, statusCode, null);

    public static Result Failure(string message, int statusCode = 400)
        => new Result(false, message, statusCode, null);
}