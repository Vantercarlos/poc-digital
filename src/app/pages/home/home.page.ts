import { Router } from '@angular/router';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { Component, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';
import { EventMessage, EventType, InteractionStatus } from '@azure/msal-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})

export class HomePage implements OnInit{
  loginDisplay = false;
  
  constructor(private authService: MsalService, private router: Router, private msalBroadcastService: MsalBroadcastService) {}

  ngOnInit(): void {
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
      )
      .subscribe((result: EventMessage) => {
        console.log(result);
      });

    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None)
      )
      .subscribe((res: any) => {
        console.log(res);
        this.setLoginDisplay();
      })
  }

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/sign-in');
  }
}
