import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements OnInit {
  user: any = null;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.user = this.auth.getSession();
    if (!this.user) this.router.navigate(['/login']);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
