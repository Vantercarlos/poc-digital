import { AuthService } from 'src/app/services/auth.service';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class IfdAuthGuard implements CanActivate {

  loginDisplay = false;
  jwtPayload: any;

  constructor(
    private authService: MsalService,
    private jwtHelper: JwtHelperService,
    private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log('IfdAuthGuard#canActivate called');
    return true;
  }

  negateAccess(): boolean {
    this.router.navigateByUrl('/sign-in');
    return false;
  }
}
