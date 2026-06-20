// 404 handler — mount AFTER all routes
export const notFound = (req, res, next) => {
  res.status(404).json({
    error: `Route ${req.method} ${req.originalUrl} not found`
  });
};

// Global error handler — mount LAST
export const errorHandler = (err, req, res, next) => {
  console.error('Unhandled error:', err.stack);

  // Handle JSON parse errors
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON in request body' });
  }

  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Internal Server Error'
      : err.message
  });
};
