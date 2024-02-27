import {
  CanActivate,
  Injectable,
  MethodNotAllowedException,
} from '@nestjs/common';
import { EntityService } from '@newbee/api/shared/data-access';
import {
  registerNotWaitlistMethodNotAllowed,
  waitlistClosedMethodNotAllowed,
} from '@newbee/shared/util';

/**
 * A guard that prevents users from accessing the endpoint unless the waitlist is open and registration is closed.
 */
@Injectable()
export class WaitlistGuard implements CanActivate {
  constructor(private readonly entityService: EntityService) {}

  /**
   * Allows users to access a given route if waitlist is open and registration is closed.
   *
   * @returns `true` if waitlist is open and registration is closed, throws otherwise.
   * @throws {MethodNotAllowedException} `registerNotWaitlistMethodNotAllowed`, `waitlistClosedMethodNotAllowed`. If registration is open or waitlist is closed.
   */
  async canActivate(): Promise<boolean> {
    const adminControls = await this.entityService.getAdminControls();
    if (adminControls.allowRegistration) {
      throw new MethodNotAllowedException(registerNotWaitlistMethodNotAllowed);
    } else if (!adminControls.allowWaitlist) {
      throw new MethodNotAllowedException(waitlistClosedMethodNotAllowed);
    }

    return true;
  }
}
