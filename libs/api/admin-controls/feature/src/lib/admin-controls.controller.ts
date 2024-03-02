import {
  Body,
  Controller,
  Get,
  Logger,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AdminControlsService } from '@newbee/api/admin-controls/data-access';
import { SearchService } from '@newbee/api/search/data-access';
import {
  EntityService,
  UserEntity,
  WaitlistMemberEntity,
} from '@newbee/api/shared/data-access';
import { Role, User } from '@newbee/api/shared/util';
import { UserService } from '@newbee/api/user/data-access';
import { WaitlistMemberService } from '@newbee/api/waitlist-member/data-access';
import { apiVersion } from '@newbee/shared/data-access';
import {
  AdminControls,
  AdminControlsRelationAndUsersDto,
  AppSearchDto,
  AppSearchResultsDto,
  AppSuggestDto,
  EmailDto,
  Keyword,
  OffsetAndLimitDto,
  PaginatedResults,
  SuggestResultsDto,
  UpdateAdminControlsDto,
  UserRoleEnum,
  apiRoles,
  defaultLimit,
} from '@newbee/shared/util';

/**
 * The controller that interacts with `AdminControlsEntity`.
 */
@Controller({
  path: Keyword.Admin,
  version: apiVersion.admin,
})
@Role(apiRoles.admin)
export class AdminControlsController {
  private readonly logger = new Logger(AdminControlsController.name);

  constructor(
    private readonly adminControlsService: AdminControlsService,
    private readonly entityService: EntityService,
    private readonly searchService: SearchService,
    private readonly userService: UserService,
    private readonly waitlistMemberService: WaitlistMemberService,
  ) {}

  /**
   * The API route for getting admin controls.
   *
   * @param user The user making the request.
   *
   * @returns The NewBee instance's admin controls.
   */
  @Get()
  async get(
    @User() user: UserEntity,
  ): Promise<AdminControlsRelationAndUsersDto> {
    this.logger.log(
      `Get admin controls request received from user ID: ${user.id}`,
    );
    const adminControlsRelation =
      await this.entityService.getAdminControlsRelation();
    const [users, count] = await this.userService.getAllAndCount({
      offset: 0,
      limit: defaultLimit,
    });
    this.logger.log(`Got admin controls for user ID: ${user.id}`);
    return new AdminControlsRelationAndUsersDto(adminControlsRelation, {
      results: users,
      total: count,
      offset: 0,
      limit: defaultLimit,
    });
  }

  /**
   * The API route for updating admin controls.
   *
   * @param updateAdminControlsDto The new details for the admin controls.
   * @param user The user making the request.
   *
   * @returns The updated admin controls.
   */
  @Patch()
  async update(
    @Body() updateAdminControlsDto: UpdateAdminControlsDto,
    @User() user: UserEntity,
  ): Promise<AdminControls> {
    this.logger.log(
      `Update admin controls request received from user ID: ${user.id}`,
    );
    const adminControls = await this.adminControlsService.update(
      updateAdminControlsDto,
    );
    this.logger.log(`Updated admin controls for user ID: ${user.id}`);
    return adminControls;
  }

  /**
   * The API route for turning a user into an admin.
   *
   * @param emailDto The email of the user to turn into an admin.
   *
   * @returns The updated user.
   * @throws {NotFoundException} `userEmailNotFound`. If the ORM throws a `NotFoundError`.
   * @throws {BadRequestException} `userEmailTakenBadRequest`. If the ORM throws a `UniqueConstraintViolationException`.
   */
  @Post(Keyword.User)
  async makeUserAdmin(@Body() emailDto: EmailDto): Promise<UserEntity> {
    const { email } = emailDto;
    this.logger.log(`Make admin request received for user: ${email}`);
    let user = await this.userService.findOneByEmail(email);
    user = await this.userService.update(user, { role: UserRoleEnum.Admin });
    this.logger.log(`User successfully made into an admin: ${email}`);
    return user;
  }

  /**
   * The API route for getting paginated results of all of the users.
   *
   * @param offsetAndLimitDto The offset and limit for the pagination.
   *
   * @returns The result containing the retrieved users, the total number of users, and the offset we retrieved.
   */
  @Get(Keyword.User)
  async getAllUsers(
    @Query() offsetAndLimitDto: OffsetAndLimitDto,
  ): Promise<PaginatedResults<UserEntity>> {
    const { offset, limit } = offsetAndLimitDto;
    this.logger.log(
      `Get all users request received with offset: ${offset} and limit: ${limit}`,
    );
    const [users, total] =
      await this.userService.getAllAndCount(offsetAndLimitDto);
    this.logger.log(`Got all users, total count: ${total}`);
    return { ...offsetAndLimitDto, total, results: users };
  }

  /**
   * The API route for getting paginated results of all of the waitlist members.
   *
   * @param offsetAndLimitDto The offset and limit for the pagination.
   *
   * @returns The result containing the retrieved waitlist members, the total number of waitlist members, and the offset we retrieved.
   */
  @Get(Keyword.Waitlist)
  async getAllWaitlistMembers(
    @Query() offsetAndLimitDto: OffsetAndLimitDto,
  ): Promise<PaginatedResults<WaitlistMemberEntity>> {
    const { offset, limit } = offsetAndLimitDto;
    this.logger.log(
      `Get all waitlist members request received with offset: ${offset} and limit: ${limit}`,
    );
    const [waitlistMembers, total] =
      await this.waitlistMemberService.getAllAndCount(offsetAndLimitDto);
    this.logger.log(`Got all waitlist members, total count: ${total}`);
    return { ...offsetAndLimitDto, total, results: waitlistMembers };
  }

  /**
   * The API route for making app query suggestions.
   *
   * @param appSuggestDto The information for generating a suggestion.
   *
   * @returns The suggestions as an array of strings.
   */
  @Get(Keyword.Suggest)
  async suggest(
    @Query() appSuggestDto: AppSuggestDto,
  ): Promise<SuggestResultsDto> {
    this.logger.log(
      `Suggest request received: ${JSON.stringify(appSuggestDto)}`,
    );
    const result = await this.searchService.appSuggest(appSuggestDto);
    this.logger.log(`Suggest results generated: ${JSON.stringify(result)}`);
    return result;
  }

  /**
   * The API route for searching the app.
   *
   * @param appSearchDto The search information.
   *
   * @returns The results of the search.
   */
  @Get(Keyword.Search)
  async search(
    @Query() appSearchDto: AppSearchDto,
  ): Promise<AppSearchResultsDto> {
    this.logger.log(`Search request received: ${JSON.stringify(appSearchDto)}`);
    const result = await this.searchService.appSearch(appSearchDto);
    this.logger.log(`Search results generated: ${JSON.stringify(result)}`);
    return result;
  }
}
