namespace CareConnect.API.Models
{
    public class Result<T>
    {
        public bool Success { get; private set; }
        public IReadOnlyList<string> Errors { get; private set; } = Array.Empty<string>();
        public T? Data { get; private set; }

        public static Result<T> Ok(T data) => new Result<T>
        {
            Success = true,
            Data = data
        };

        public static Result<T> Fail(params string[] errors) => new Result<T>
        {
            Success = false,
            Errors = errors
        };
    }

    public class Result
    {
        public bool Success { get; private set; }
        public IReadOnlyList<string> Errors { get; private set; } = Array.Empty<string>();

        public static Result Ok() => new Result
        {
            Success = true
        };

        public static Result Fail(params string[] errors) => new Result
        {
            Success = false,
            Errors = errors
        };
    }
}