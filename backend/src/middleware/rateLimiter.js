import rateLimit from '../config/upstash.js';

const rateLimiter = async (req, res, next) => {
  try {
    const { success } = await rateLimit.limit(req.ip);
    if (!success) {
      return res.status(429).json({ error: 'Too many requests' });
    }
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export default rateLimiter;
