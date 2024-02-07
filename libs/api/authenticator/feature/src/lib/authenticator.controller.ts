import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  AuthenticatorService,
  RegistrationResponseDto,
} from '@newbee/api/authenticator/data-access';
import {
  AuthenticatorEntity,
  NameDto,
  UserEntity,
} from '@newbee/api/shared/data-access';
import { UnverifiedOk, User } from '@newbee/api/shared/util';
import { apiVersion } from '@newbee/shared/data-access';
import { Authenticator, Keyword } from '@newbee/shared/util';
import type { PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/typescript-types';

/**
 * The controller that interacts with the `AuthenticatorEntity`.
 */
@Controller({ path: Keyword.Authenticator, version: apiVersion.authenticator })
@UnverifiedOk()
export class AuthenticatorController {
  private readonly logger = new Logger(AuthenticatorController.name);

  constructor(private readonly authenticatorService: AuthenticatorService) {}

  /**
   * The API route for getting all authenticators associated with the logged in user.
   *
   * @param user The user whose authenticators to look for.
   *
   * @returns The authenticators of the logged in user.
   */
  @Get()
  async getAll(@User() user: UserEntity): Promise<Authenticator[]> {
    this.logger.log(
      `Get all authenticators request received for user ID: ${user.id}`,
    );
    const authenticators = await this.authenticatorService.findAllByUser(user);
    this.logger.log(
      `${authenticators.length} authenticators found for user ID: ${user.id}`,
    );
    return authenticators;
  }

  /**
   * The API route for starting the WebAuthn authenticator registration process for a logged in user.
   *
   * @param user The user to associate with the authenticator.
   * @returns The registration options for the new authenticator.
   */
  @Post(Keyword.Options)
  async createOptions(
    @User() user: UserEntity,
  ): Promise<PublicKeyCredentialCreationOptionsJSON> {
    this.logger.log(
      `Create authenticator registration options request received for user ID: ${user.id}`,
    );

    const options = await this.authenticatorService.generateOptions(user);
    this.logger.log(
      `Authenticator registration options created: ${JSON.stringify(options)}`,
    );

    return options;
  }

  /**
   * The API route for completing the WebAuthn authenticator registration process for a logged in user.
   *
   * @param response The credential generated by the authenticator.
   * @param user The user to associate with the authenticator.
   *
   * @returns The newly created authenticator.
   * @throws {BadRequestException} `authenticatorVerifyBadRequest`, `authenticatorTakenBadRequest`. If the authenticator cannot be verified or is already in use.
   * @throws {InternalServerErrorException} `internalServerError`. For any other type of error.
   */
  @Post()
  async create(
    @Body() registrationResponseDto: RegistrationResponseDto,
    @User() user: UserEntity,
  ): Promise<AuthenticatorEntity> {
    const { response } = registrationResponseDto;
    const responseString = JSON.stringify(response);
    this.logger.log(
      `Create authenticator verify request received for user ID: ${user.id}, response: ${responseString}`,
    );

    const authenticator = await this.authenticatorService.create(
      response,
      user,
    );
    this.logger.log(
      `Authenticator created for user ID: ${user.id}, ID: ${authenticator.id}, credential ID: ${authenticator.credentialId}`,
    );

    return authenticator;
  }

  /**
   * The API route for updating the authenticator's name value.
   *
   * @param id The ID of the authenticator to edit.
   * @param nameDto The new value for name.
   * @param user The user making the request.
   *
   * @returns The udpated authenticator, if it was updated successfully.
   * @throws {NotFoundException} `authenticatorIdNotFound`. If the authenticator cannot be found by the given ID.
   * @throws {ForbiddenException} `forbiddenError`. If the authenticator's user and the provided user IDs do not match.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any other error.
   */
  @Patch(`:${Keyword.Authenticator}`)
  async updateName(
    @Param(Keyword.Authenticator) id: string,
    @Body() nameDto: NameDto,
    @User() user: UserEntity,
  ): Promise<AuthenticatorEntity> {
    const { name } = nameDto;
    this.logger.log(
      `Update authenticator name request received for authenticator ID: ${id}, from user ID: ${user.id}, with new name: ${name}`,
    );
    const authenticator = await this.authenticatorService.updateNameById(
      id,
      name,
      user.id,
    );
    this.logger.log(`Authenticator updated for authenticator ID: ${id}`);
    return authenticator;
  }

  /**
   * The API route for deleting an authenticator.
   *
   * @param id The ID of the authenticator to delete.
   * @param user The user making the request.
   *
   * @throws {ForbiddenException} `forbiddenError`. If the authenticator's user ID and the given user IDs do not match.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  @Delete(`:${Keyword.Authenticator}`)
  async delete(
    @Param(Keyword.Authenticator) id: string,
    @User() user: UserEntity,
  ): Promise<void> {
    this.logger.log(
      `Delete authenticator request received for authenticator ID: ${id}, from user ID: ${user.id}`,
    );
    await this.authenticatorService.deleteOneById(id, user.id);
    this.logger.log(`Successfully deleted authenticator ID: ${id}`);
  }
}
