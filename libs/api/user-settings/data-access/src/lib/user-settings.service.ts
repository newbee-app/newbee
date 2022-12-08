import { EntityRepository, NotFoundError } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UserSettingsEntity } from '@newbee/api/shared/data-access';
import {
  idNotFoundErrorMsg,
  internalServerErrorMsg,
} from '@newbee/api/shared/util';

@Injectable()
export class UserSettingsService {
  private readonly logger = new Logger(UserSettingsService.name);

  constructor(
    @InjectRepository(UserSettingsEntity)
    private readonly userSettingsRepository: EntityRepository<UserSettingsEntity>
  ) {}

  async findOneById(id: string): Promise<UserSettingsEntity> {
    try {
      return await this.userSettingsRepository.findOneOrFail(id);
    } catch (err) {
      this.logger.error(err);

      if (err instanceof NotFoundError) {
        throw new NotFoundException(
          idNotFoundErrorMsg('a', 'user settings', 'an', 'ID', id)
        );
      }

      throw new InternalServerErrorException(internalServerErrorMsg);
    }
  }
}
