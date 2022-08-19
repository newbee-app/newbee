import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  authVersion,
  CreateUserDto,
  MagicLinkLoginLoginDto,
} from '@newbee/shared/data-access';
import { magicLinkLogin } from '@newbee/shared/util';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(private readonly http: HttpClient) {}

  login(
    magicLinkLoginLoginDto: MagicLinkLoginLoginDto
  ): Observable<HttpResponse<unknown>> {
    return this.http.post(
      `/api/auth/${authVersion}/${magicLinkLogin}/login`,
      magicLinkLoginLoginDto,
      { observe: 'response' }
    );
  }

  register(createUserDto: CreateUserDto): Observable<HttpResponse<unknown>> {
    return this.http.post(
      `/api/auth/${authVersion}/${magicLinkLogin}/register`,
      createUserDto,
      { observe: 'response' }
    );
  }
}
