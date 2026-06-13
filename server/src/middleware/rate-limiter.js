import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
  try {
    const identifier = req.user?.id || req.ip || "anonymous";
    const { success } = await ratelimit.limit(identifier);

    if (!success) {
      return res.status(429).json({
        message: "Too many requests, please try again later",
      });
    }

    next();
  } catch (error) {
    return res.status(503).json({
      message: "Service temporarily unavailable",
    });
  }
};

export default rateLimiter;
