import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { authenticatorVersion } from '@newbee/shared/data-access';
import { Authenticator } from '@newbee/shared/util';
import { startRegistration } from '@simplewebauthn/browser';
import type { PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/typescript-types';
import { from, Observable, switchMap } from 'rxjs';

@Injectable()
export class AuthenticatorService {
  constructor(private readonly http: HttpClient) {}

  createGet(): Observable<PublicKeyCredentialCreationOptionsJSON> {
    return this.http.get<PublicKeyCredentialCreationOptionsJSON>(
      `/api/v${authenticatorVersion}/authenticator/create`
    );
  }

  createPost(
    options: PublicKeyCredentialCreationOptionsJSON
  ): Observable<Authenticator> {
    return from(startRegistration(options)).pipe(
      switchMap((credential) => {
        return this.http.post<Authenticator>(
          `/api/v${authenticatorVersion}/authenticator/create`,
          credential
        );
      })
    );
  }
}
