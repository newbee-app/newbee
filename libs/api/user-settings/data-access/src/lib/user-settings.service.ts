import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSettingsEntity } from '@newbee/api/shared/data-access';
import { internalServerErrorMsg } from '@newbee/api/shared/util';
import { Repository } from 'typeorm';

@Injectable()
export class UserSettingsService {
  private readonly logger = new Logger(UserSettingsService.name);

  constructor(
    @InjectRepository(UserSettingsEntity)
    private readonly userSettingsRepository: Repository<UserSettingsEntity>
  ) {}

  async findOneById(id: string): Promise<UserSettingsEntity | null> {
    try {
      return await this.userSettingsRepository.findOne({
        where: { userId: id },
      });
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerErrorMsg);
    }
  }
}
