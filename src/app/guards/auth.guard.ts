import { AuthService } from 'src/app/services/auth.service';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const userRoles = JSON.parse(localStorage.getItem('userRoles') || '[]');
    if (userRoles.length > 0) {
      this.authService.isLoggedIn = true;
      this.authService.userRoles = userRoles;
    }

    if (!this.authService.isLoggedIn) return this.goToSignIn();
    return true;
  }

  goToSignIn(): boolean {
    this.router.navigateByUrl('/sign-in');
    return false;
  }
}
