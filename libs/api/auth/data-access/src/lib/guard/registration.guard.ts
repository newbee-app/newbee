import {
  CanActivate,
  Injectable,
  MethodNotAllowedException,
} from '@nestjs/common';
import { EntityService } from '@newbee/api/shared/data-access';
import {
  registrationClosedMethodNotAllowed,
  waitlistNotRegisterMethodNotAllowed,
} from '@newbee/shared/util';

/**
 * A guard that prevents users from accessing the endpoint unless registration is open.
 */
@Injectable()
export class RegistrationGuard implements CanActivate {
  constructor(private readonly entityService: EntityService) {}

  /**
   * Allows users to access a given route if registration is open.
   *
   * @returns `true` if registration is open, throws otherwise.
   * @throws {MethodNotAllowedException} `waitlistNotRegisterMethodNotAllowed`, `registrationClosedMethodNotAllowed`. If registration is closed.
   */
  async canActivate(): Promise<boolean> {
    const adminControls = await this.entityService.getAdminControls();
    if (!adminControls.allowRegistration) {
      if (adminControls.allowWaitlist) {
        throw new MethodNotAllowedException(
          waitlistNotRegisterMethodNotAllowed,
        );
      } else {
        throw new MethodNotAllowedException(registrationClosedMethodNotAllowed);
      }
    }

    return true;
  }
}
