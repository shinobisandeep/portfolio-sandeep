import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AuthData } from "./auth-data.model";


@Injectable({ providedIn: "root"})
export class AuthService{
  private token: string='';
  constructor(private http: HttpClient, private router:Router){

  }
  getToken(){
    return this.token;
  }

 createUser(email:string, password:string){
  const authData:AuthData= {email: email, password: password};
 this.http.post("http://localhost:3000/api/user/signup",authData)
 .subscribe(response => {
  console.log(response);
  this.router.navigate(["/login"]);
 });
 }
 login(email:string, password:string){
  const authData:AuthData= {email: email, password: password};
  this.http.post<{token: string}>("http://localhost:3000/api/user/login",authData).subscribe(
    response=>{
      const token= response.token;
      this.token= token;
      this.router.navigate(["/"]);
    }
  );
 }
}