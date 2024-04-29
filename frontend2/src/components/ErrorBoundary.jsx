function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="flex-grow self-center text-center">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button
        onClick={resetErrorBoundary}
        className="bg-white rounded px-2 py-1"
      >
        Try again
      </button>
    </div>
  );
}

export default ErrorFallback;
