export const errorHandler = (err, req, res, next) => {
  console.error("[API Error]", err);

  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "You have already submitted a rating for this item today.",
    });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: messages.join(", "),
    });
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || "An unexpected server error occurred.",
  });
};
