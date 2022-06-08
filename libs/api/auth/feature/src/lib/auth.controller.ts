import {
  Body,
  ConflictException,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { MagicLoginStrategy } from '@newbee/api/auth/data-access';
import {
  MagicLoginAuthGuard,
  MagicLoginLoginDto,
  MagicLoginRegisterDto,
} from '@newbee/api/auth/util';
import { User as UserEntity } from '@newbee/api/shared/data-access';
import { User } from '@newbee/api/shared/util';
import { UserService } from '@newbee/api/user/data-access';
import { CreateUserDto } from '@newbee/api/user/util';
import { Request, Response } from 'express';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly userService: UserService,
    private readonly magicLoginStrategy: MagicLoginStrategy
  ) {}

  @Post(['magic-login', 'login'])
  async checkAndLogin(
    @Body() magicLoginLoginDto: MagicLoginLoginDto,
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    this.logger.log(
      `Check and login request received: ${JSON.stringify(magicLoginLoginDto)}`
    );
    const user = await this.userService.findOneByEmail(
      magicLoginLoginDto.destination
    );
    if (!user) {
      const errorMsg = `User not found for email: ${magicLoginLoginDto.destination}`;
      this.logger.error(errorMsg);
      throw new NotFoundException(errorMsg);
    }

    this.logger.log(
      `Valid email found for email: ${magicLoginLoginDto.destination}, sending magic link`
    );
    this.magicLoginStrategy.send(req, res);
  }

  @Post(['magic-login', 'register'])
  async checkAndRegister(
    @Body() magicLoginRegisterDto: MagicLoginRegisterDto,
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const magicLoginRegisterDtoString = JSON.stringify(magicLoginRegisterDto);
    this.logger.log(
      `Check and register request received: ${magicLoginRegisterDtoString}`
    );

    let user = await this.userService.findOneByEmail(
      magicLoginRegisterDto.destination
    );
    if (user) {
      const errorMsg = `User found for email: ${magicLoginRegisterDto.destination}, sending user login magic link instead of registering`;
      this.logger.error(errorMsg);
      this.magicLoginStrategy.send(req, res);
      throw new ConflictException(errorMsg);
    }

    const { destination, ...userData } = magicLoginRegisterDto;
    const createUserDto: CreateUserDto = {
      email: destination,
      ...userData,
    };
    user = await this.userService.create(createUserDto);
    if (!user) {
      const errorMsg = `User could not be created for: ${magicLoginRegisterDtoString}`;
      this.logger.error(errorMsg);
      throw new InternalServerErrorException(errorMsg);
    }

    this.logger.log(`Created user: ${JSON.stringify(user)}`);
    this.magicLoginStrategy.send(req, res);
  }

  @UseGuards(MagicLoginAuthGuard)
  @Get('magic-login')
  async magicLoginCallback(@User() user: UserEntity): Promise<UserEntity> {
    return user;
  }
}
