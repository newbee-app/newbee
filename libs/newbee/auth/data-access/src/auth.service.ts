import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {
  constructor(private readonly http: HttpClient) {}

  async login(email: string) {

  }
}
