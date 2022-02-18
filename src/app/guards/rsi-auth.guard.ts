import { AuthService } from 'src/app/services/auth.service';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

@Injectable({
  providedIn: 'root',
})
export class RsiAuthGuard implements CanActivate {

  loginDisplay = false;
  displayedColumns: string[] = ['claim', 'value'];
  dataSource: any =[];

  constructor(private authService: MsalService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log('RsiAuthGuard#canActivate called');
    this.loginDisplay = this.authService.instance.getActiveAccount()?.idTokenClaims as any;
    //this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
    console.log(this.loginDisplay);
    return true;
  }

  negateAccess(): boolean {
    this.router.navigateByUrl('/sign-in');
    return false;
  }
}
