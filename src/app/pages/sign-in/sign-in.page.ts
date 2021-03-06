import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { AuthenticationResult, InteractionStatus, PopupRequest, EventMessage, EventType } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  template: `
    <div class="login-app">
      <form class="login-form" (ngSubmit)="loginPopup()">
        <button type="submit">Login</button>
      </form>
    </div>
  `,
  styles: [
    `
      .login-app {
        width: 30vw;
        border: 2px dashed black;
        padding: 8px;
        margin: 0 auto;
      }
      .login-form {
        display: flex;
        align-items: center;
        flex-direction: column;
        margin: 0 auto;
        padding: 8px;
      }
      label {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInPage implements OnInit, OnDestroy {
  isIframe = false;
  loginDisplay = false;
  private readonly _destroying$ = new Subject<void>();

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authServiceMsal: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private router: Router) { }

  ngOnInit(): void {
    this.isIframe = window !== window.parent && !window.opener;
    this.setLoginDisplay();

    this.authServiceMsal.instance.enableAccountStorageEvents(); 
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.ACCOUNT_ADDED || msg.eventType === EventType.ACCOUNT_REMOVED),
      )
      .subscribe((result: EventMessage) => {
        if (this.authServiceMsal.instance.getAllAccounts().length === 0) {
          window.location.pathname = "/";
        } else {
          this.setLoginDisplay();
        }
      });

    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.setLoginDisplay();
        this.checkAndSetActiveAccount();
      })
  }

  setLoginDisplay() {
    this.loginDisplay = this.authServiceMsal.instance.getAllAccounts().length > 0;
  }

  checkAndSetActiveAccount() {
    let activeAccount = this.authServiceMsal.instance.getActiveAccount();

    if (!activeAccount && this.authServiceMsal.instance.getAllAccounts().length > 0) {
      let accounts = this.authServiceMsal.instance.getAllAccounts();
      this.authServiceMsal.instance.setActiveAccount(accounts[0]);
    }
  }

  loginPopup() {
    if (this.msalGuardConfig.authRequest) {
      this.authServiceMsal.loginPopup({ ...this.msalGuardConfig.authRequest } as PopupRequest)
        .subscribe((response: AuthenticationResult) => {
          this.authServiceMsal.instance.setActiveAccount(response.account);
        });
    } else {
      this.authServiceMsal.loginPopup()
        .subscribe((response: AuthenticationResult) => {
          this.authServiceMsal.instance.setActiveAccount(response.account);
        });
    }
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
