import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginForm, RegisterForm } from '@newbee/newbee/auth/util';
import {
  auth,
  authVersion,
  BaseCreateUserDto,
  BaseEmailDto,
  BaseMagicLinkLoginDto,
  BaseUserAndOptionsDto,
  BaseWebAuthnLoginDto,
  login,
  register,
  webauthn,
} from '@newbee/shared/data-access';
import type { User } from '@newbee/shared/util';
import { magicLinkLogin } from '@newbee/shared/util';
import { startAuthentication } from '@simplewebauthn/browser';
import type { PublicKeyCredentialRequestOptionsJSON } from '@simplewebauthn/typescript-types';
import type { CountryCode } from 'libphonenumber-js';
import parsePhoneNumber from 'libphonenumber-js';
import { from, Observable, switchMap } from 'rxjs';

/**
 * The service tied to the API's auth endpoints.
 * Handles logging in and registering users.
 */
@Injectable()
export class AuthService {
  constructor(private readonly http: HttpClient) {}

  /**
   * Convert the given login form to a `BaseEmailDto` and send a GET request to send a magic link for login.
   *
   * @param loginForm The login form containing the necessary email.
   * @returns An observable containing the magic link's JWT ID and the email the magic link was sent to.
   */
  magicLinkLoginLogin(loginForm: LoginForm): Observable<BaseMagicLinkLoginDto> {
    const emailDto = this.loginFormToEmailDto(loginForm);
    const params = new HttpParams({ fromObject: { ...emailDto } });
    return this.http.get<BaseMagicLinkLoginDto>(
      `/api/v${authVersion}/${auth}/${magicLinkLogin}/${login}`,
      { params }
    );
  }

  /**
   * Sends a GET request to verify the magic link token.
   *
   * @param token The token associated with the magic link.
   * @returns An observable containing information about the logged in user.
   */
  magicLinkLogin(token: string): Observable<User> {
    const params = new HttpParams({ fromObject: { token } });
    return this.http.get<User>(
      `/api/v${authVersion}/${auth}/${magicLinkLogin}`,
      { params }
    );
  }

  /**
   * Converts the given register form to a `BaseCreateUserDto` and sends a POST request to make the backend create a new user, access token, and generate the options needed to register an authenticator.
   *
   * @param registerForm The register form containing the necessary information for creating a new user.
   * @returns An observable containing the newly created user, their access token, and the options needed to register an authenticator.
   */
  webAuthnRegister(
    registerForm: RegisterForm
  ): Observable<BaseUserAndOptionsDto> {
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
    return this.http.post<BaseUserAndOptionsDto>(
      `/api/v${authVersion}/${auth}/${webauthn}/${register}`,
      createUserDto
    );
  }

  /**
   * Converts the given login form to a `BaseEmailDto` and sends a GET request to create login authenticator options.
   *
   * @param loginForm The login form containing the necessary email.
   * @returns An observable of the options needed to log in with a registered authenticator.
   */
  webAuthnLoginGet(
    loginForm: LoginForm
  ): Observable<PublicKeyCredentialRequestOptionsJSON> {
    const emailDto = this.loginFormToEmailDto(loginForm);
    const params = new HttpParams({ fromObject: { ...emailDto } });
    return this.http.get<PublicKeyCredentialRequestOptionsJSON>(
      `/api/v${authVersion}/${auth}/${webauthn}/${login}`,
      { params }
    );
  }

  /**
   * Converts the given login form to a `BaseEmailDto` and combines it with the given options to create a `BaseWebAuthnLoginDto`, which it uses to send a POST request to verify the authenticator's response and log the user in.
   *
   * @param loginForm The login form containing the necessary email.
   * @param options The options to feed into the authenticator.
   * @returns An observable containing information about the logged in user.
   */
  webAuthnLoginPost(
    loginForm: LoginForm,
    options: PublicKeyCredentialRequestOptionsJSON
  ): Observable<User> {
    const emailDto = this.loginFormToEmailDto(loginForm);
    return from(startAuthentication(options)).pipe(
      switchMap((credential) => {
        const webAuthnLoginDto: BaseWebAuthnLoginDto = {
          ...emailDto,
          credential,
        };
        return this.http.post<User>(
          `/api/v${authVersion}/${auth}/${webauthn}/${login}`,
          webAuthnLoginDto
        );
      })
    );
  }

  private loginFormToEmailDto(loginForm: LoginForm): BaseEmailDto {
    return { email: loginForm.email ?? '' };
  }
}
