import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserChallengeEntity } from '@newbee/api/shared/data-access';
import {
  idNotFoundErrorMsg,
  idNotFoundLogMsg,
  internalServerErrorMsg,
} from '@newbee/api/shared/util';
import { Repository } from 'typeorm';

@Injectable()
export class UserChallengeService {
  private readonly logger = new Logger(UserChallengeService.name);

  constructor(
    @InjectRepository(UserChallengeEntity)
    private readonly userChallengeRepository: Repository<UserChallengeEntity>
  ) {}

  async findOneById(id: string): Promise<UserChallengeEntity | null> {
    try {
      return await this.userChallengeRepository.findOne({
        where: { userId: id },
      });
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerErrorMsg);
    }
  }

  async update(
    id: string,
    challenge: string | null
  ): Promise<UserChallengeEntity> {
    const userChallenge = await this.findOneById(id);
    if (!userChallenge) {
      this.logger.error(idNotFoundLogMsg('update', 'a', 'user challenge', id));
      throw new NotFoundException(
        idNotFoundErrorMsg('a', 'user challenge', id)
      );
    }

    try {
      return await this.userChallengeRepository.save({
        ...userChallenge,
        challenge,
      });
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerErrorMsg);
    }
  }
}
