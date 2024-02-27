import { IsEmail, IsNotEmpty } from 'class-validator';
import { emailIsEmail, nameIsNotEmpty } from '../../constant';
import { CommonEntityFields, WaitlistMember } from '../../interface';

/**
 * A DTO sent from the frontend to the backend to create a new waitlist member.
 * Suitable for use in POST requests.
 */
export class CreateWaitlistMemberDto
  implements Omit<WaitlistMember, keyof CommonEntityFields>
{
  /**
   * @inheritdoc
   */
  @IsEmail(undefined, { message: emailIsEmail })
  readonly email: string;

  /**
   * @inheritdoc
   */
  @IsNotEmpty({ message: nameIsNotEmpty })
  readonly name: string;

  constructor(email: string, name: string) {
    this.email = email;
    this.name = name;
  }
}
