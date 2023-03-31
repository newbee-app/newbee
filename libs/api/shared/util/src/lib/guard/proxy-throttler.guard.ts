import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import type { Request } from 'express';

/**
 * The custom throttler guard to use that respects proxies.
 */
@Injectable()
export class ProxyThrottlerGuard extends ThrottlerGuard {
  /**
   * Make the throttler respect proxies by getting the correct IP information.
   *
   * @param req The request the guard receives.
   * @returns The correct tracking information for the request.
   */
  protected override getTracker(req: Request): string {
    return req.ips[0] ?? req.ip;
  }
}
