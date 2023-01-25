import {
  Cascade,
  Entity,
  ManyToOne,
  OneToOne,
  Property,
  Unique,
} from '@mikro-orm/core';
import { CRUD, Possession } from '@newbee/api/shared/util';
import { GrantEntity } from './grant.entity';
import { OrganizationEntity } from './organization.entity';
import { PostEntity } from './post.abstract.entity';
import { ResourceEntity } from './resource.entity';
import { RoleEntity } from './role.entity';
import { TeamEntity } from './team.entity';
import { UserOrganizationEntity } from './user-organization.entity';

/**
 * The MikroORM entity representing a `QnA`, a type of `Post`.
 * The `slug` must be unique within an `organization`.
 */
@Entity()
@Unique<QnaEntity>({ properties: ['organization', 'slug'] })
export class QnaEntity extends PostEntity {
  /**
   * @inheritdoc
   */
  @ManyToOne(() => OrganizationEntity)
  organization: OrganizationEntity;

  /**
   * @inheritdoc
   */
  @ManyToOne(() => TeamEntity, { nullable: true })
  team: TeamEntity | null;

  /**
   * @inheritdoc
   */
  @Property()
  slug: string;

  /**
   * @inheritdoc
   */
  @OneToOne(() => ResourceEntity, (resource) => resource.qna, {
    cascade: [Cascade.ALL],
  })
  resource = new ResourceEntity(this);

  /**
   * The raw markdown of the question portion of the QnA.
   */
  @Property({ type: 'text' })
  questionMarkdown: string;

  /**
   * The raw markdown of the question rendered into HTML, for display on the frontend.
   */
  @Property({ type: 'text' })
  renderedQuestion: string;

  /**
   * The raw markdown of the answer portion of the QnA.
   */
  @Property({ type: 'text' })
  answerMarkdown: string;

  /**
   * The raw markdown of the answer rendered into HTML, for display on the frontend.
   */
  @Property({ type: 'text' })
  renderedAnswer: string;

  constructor(
    organization: OrganizationEntity,
    team: TeamEntity | null,
    slug: string,
    questionMarkdown: string,
    renderedQuestion: string,
    answerMarkdown: string,
    renderedAnswer: string,
    creator: UserOrganizationEntity
  ) {
    super();
    this.organization = organization;
    this.team = team;
    this.slug = slug;
    this.questionMarkdown = questionMarkdown;
    this.renderedQuestion = renderedQuestion;
    this.answerMarkdown = answerMarkdown;
    this.renderedAnswer = renderedAnswer;

    const owner = new RoleEntity({ users: [creator] });
    this.generateOwnerGrants(owner);
  }

  /**
   * A helper function for generating the grants associated with the QnA owner role.
   * @param owner The owner `RoleEntity`.
   */
  private generateOwnerGrants(owner: RoleEntity): void {
    // Owners can update any property of the QnA, except the ID, resource, createdAt, and the organization it belongs to
    new GrantEntity(owner, this.resource, CRUD.U, Possession.Any, [
      '*',
      '!id',
      '!createdAt',
      '!organization',
      '!resource',
    ]);

    // Owners can delete the QnA itself (being able to delete the primary key implies being able to delete the do)
    new GrantEntity(owner, this.resource, CRUD.D, Possession.Any, ['*']);
  }
}
