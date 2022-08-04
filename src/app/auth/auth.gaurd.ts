import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot,Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGaurd implements CanActivate{

  constructor(private authService:AuthService, private router: Router){}


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
  boolean | Observable<boolean > |
  Promise<boolean>
  {
    const isAUth= this.authService.getIsAuth();
    if(!isAUth){
      this.router.navigate(['/login']);
    }
   return isAUth;
  }


}
