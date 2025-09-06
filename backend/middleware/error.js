
export function errorHandler(err, req, res, next) {
  console.error(err);

  // Default to 500 if status not set
  const status = err.status || 500;

  // fallback message
  const message = err.message || "Something went wrong. Please try again later";

  res.status(status).json({ message });
}
