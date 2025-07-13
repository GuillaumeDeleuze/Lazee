import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

import 'dotenv/config';

const rateLimit = new Redis({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10s'),
});

export default rateLimit;
