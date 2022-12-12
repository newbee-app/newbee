import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../constant';

/**
 * The decorator used to mark a controller function as public, meaning users don't need to be logged in to access the endpoint.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
