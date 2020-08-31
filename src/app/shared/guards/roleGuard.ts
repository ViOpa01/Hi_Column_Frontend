import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../../providers/auth.service';
import { PayVueApiService } from 'app/providers/payvue-api.service';

@Injectable({
    providedIn: 'root'
})

export class RoleGuard implements CanActivate {


    constructor(private payvueservice: PayVueApiService, private authService: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot) {
        const user = this.payvueservice.getUser();
        const roles = route.data['allowedRoles'] as string;
        let isAadmin = false;
        // if (user.role.some(r => roles.includes(r))) {
            if (roles.includes(user.role.toLowerCase())) {
            isAadmin = true;
        }
        if (isAadmin) return true;
        this.router.navigate(['/login']);
        return false;
    }


}


