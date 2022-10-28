import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  authVersion,
  BaseCreateUserDto,
  BaseMagicLinkLoginDto,
  BaseMagicLinkLoginLoginDto,
} from '@newbee/shared/data-access';
import { magicLinkLogin } from '@newbee/shared/util';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(private readonly http: HttpClient) {}

  login(
    magicLinkLoginLoginDto: BaseMagicLinkLoginLoginDto
  ): Observable<BaseMagicLinkLoginDto> {
    return this.http.post<BaseMagicLinkLoginDto>(
      `/api/v${authVersion}/auth/${magicLinkLogin}/login`,
      magicLinkLoginLoginDto
    );
  }

  register(
    createUserDto: BaseCreateUserDto
  ): Observable<BaseMagicLinkLoginDto> {
    return this.http.post<BaseMagicLinkLoginDto>(
      `/api/v${authVersion}/auth/${magicLinkLogin}/register`,
      createUserDto
    );
  }
}
