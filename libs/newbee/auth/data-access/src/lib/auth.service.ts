import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginForm, RegisterForm } from '@newbee/newbee/auth/util';
import {
  authVersion,
  BaseCreateUserDto,
  BaseEmailDto,
  BaseLoginDto,
  BaseMagicLinkLoginDto,
  BaseUserCreatedDto,
  BaseWebAuthnLoginDto,
} from '@newbee/shared/data-access';
import { magicLinkLogin, webauthn } from '@newbee/shared/util';
import { startAuthentication } from '@simplewebauthn/browser';
import type { PublicKeyCredentialRequestOptionsJSON } from '@simplewebauthn/typescript-types';
import type { CountryCode } from 'libphonenumber-js';
import parsePhoneNumber from 'libphonenumber-js';
import { from, Observable, switchMap } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(private readonly http: HttpClient) {}

  magicLinkLoginLogin(loginForm: LoginForm): Observable<BaseMagicLinkLoginDto> {
    const emailDto = this.loginFormToEmailDto(loginForm);
    const params = new HttpParams({ fromObject: { ...emailDto } });
    return this.http.get<BaseMagicLinkLoginDto>(
      `/api/v${authVersion}/auth/${magicLinkLogin}/login`,
      { params }
    );
  }

  magicLinkLogin(token: string): Observable<BaseLoginDto> {
    const params = new HttpParams({ fromObject: { token } });
    return this.http.get<BaseLoginDto>(
      `/api/v${authVersion}/auth/${magicLinkLogin}`,
      { params }
    );
  }

  webAuthnRegister(registerForm: RegisterForm): Observable<BaseUserCreatedDto> {
    const { email, name, displayName, phoneNumber } = registerForm;
    let phoneNumberString: string | undefined = undefined;
    if (phoneNumber && phoneNumber.number && phoneNumber.country) {
      const { number, country } = phoneNumber;
      const parsedPhoneNumber = parsePhoneNumber(
        number,
        country.regionCode as CountryCode
      );
      phoneNumberString = parsedPhoneNumber?.format('E.164');
    }

    const createUserDto: BaseCreateUserDto = {
      email: email ?? '',
      name: name ?? '',
      displayName: displayName ?? null,
      phoneNumber: phoneNumberString ?? null,
    };
    return this.http.post<BaseUserCreatedDto>(
      `/api/v${authVersion}/auth/${webauthn}/register`,
      createUserDto
    );
  }

  webAuthnLoginGet(
    loginForm: LoginForm
  ): Observable<PublicKeyCredentialRequestOptionsJSON> {
    const emailDto = this.loginFormToEmailDto(loginForm);
    const params = new HttpParams({ fromObject: { ...emailDto } });
    return this.http.get<PublicKeyCredentialRequestOptionsJSON>(
      `/api/v${authVersion}/auth/${webauthn}/login`,
      { params }
    );
  }

  webAuthnLoginPost(
    loginForm: LoginForm,
    options: PublicKeyCredentialRequestOptionsJSON
  ): Observable<BaseLoginDto> {
    const emailDto = this.loginFormToEmailDto(loginForm);
    return from(startAuthentication(options)).pipe(
      switchMap((credential) => {
        const webAuthnLoginDto: BaseWebAuthnLoginDto = {
          ...emailDto,
          credential,
        };
        return this.http.post<BaseLoginDto>(
          `/api/v${authVersion}/auth/${webauthn}/login`,
          webAuthnLoginDto
        );
      })
    );
  }

  private loginFormToEmailDto(loginForm: LoginForm): BaseEmailDto {
    return { email: loginForm.email ?? '' };
  }
}
