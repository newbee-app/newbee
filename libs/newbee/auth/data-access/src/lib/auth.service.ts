import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  authVersion,
  CreateUserDto,
  MagicLinkLoginDto,
  MagicLinkLoginLoginDto,
} from '@newbee/shared/data-access';
import { magicLinkLogin } from '@newbee/shared/util';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(private readonly http: HttpClient) {}

  login(
    magicLinkLoginLoginDto: MagicLinkLoginLoginDto
  ): Observable<MagicLinkLoginDto> {
    return this.http.post<MagicLinkLoginDto>(
      `/api/v${authVersion}/auth/${magicLinkLogin}/login`,
      magicLinkLoginLoginDto
    );
  }

  register(createUserDto: CreateUserDto): Observable<MagicLinkLoginDto> {
    return this.http.post<MagicLinkLoginDto>(
      `/api/v${authVersion}/auth/${magicLinkLogin}/register`,
      createUserDto
    );
  }
}
