import { HttpClient } from "@angular/common/http";
import { error } from "@angular/compiler/src/util";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { listeners } from "process";
import { Subject } from "rxjs";
import { AuthData } from "./auth-data.model";
import { environment } from "src/environments/environment";

const BACKEND_URL=environment.apiUrl+"/user";


@Injectable({ providedIn: "root"})
export class AuthService{
  private isAuthenticated=false;
  private token: string='';
  private authStatusListener= new Subject<boolean>();
  private tokenTimer:any;
  private userId: string='';
  constructor(private http: HttpClient, private router:Router){

  }
  getToken(){
    return this.token;
  }
 getIsAuth(){
  return this.isAuthenticated;
 }

 getUserId(){
  return this.userId;
 }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

 createUser(email:string, password:string){
  const authData:AuthData= {email: email, password: password};
 return this.http.post(BACKEND_URL+"/signup",authData).subscribe(
  ()=>{
    this.router.navigate(["/"]);
  },error=>{
    this.authStatusListener.next(false);
  });

 }


 login(email:string, password:string){
  const authData:AuthData= {email: email, password: password};
  this.http.post<{token: string,expiresIn: number,userId: string}>(BACKEND_URL+"/login",authData).subscribe(
    response=>{
      const token= response.token;
      this.token= token;
      if(token){
        const expireInDuration= response.expiresIn;
       this.setAuthTimer(expireInDuration);
      this.isAuthenticated=true;
      this.userId=response.userId;
      this.authStatusListener.next(true);
      const now = new Date();
      const expirationDate= new Date(now.getTime()+ expireInDuration*1000);
      this.saveAuthData(token,expirationDate,this.userId);
      this.router.navigate(["/"]);
      }

    },error => {
      this.authStatusListener.next(false);
    });
 }

 autoAuthUser(){
  const authInformation: any =this.getAtuthData();
  if(!authInformation){
    return;
  }
  const now= new Date();
  const expiresIn= authInformation.expirationDate.getTime() - now.getTime();
  if(expiresIn>0){
    this.token=authInformation?.token;
    this.isAuthenticated=true;
    this.userId=authInformation.userId;
    this.setAuthTimer(expiresIn/1000);
    this.authStatusListener.next(true);
  }
 }


 logout(){
  this.token= " ";
  this.isAuthenticated=false;
  this.authStatusListener.next(false);
  this.userId="";
  clearTimeout(this.tokenTimer);
  this.clearAuthData();
  this.router.navigate(["/"]);
 }


 private setAuthTimer(duration: number){

  this.tokenTimer=setTimeout(()=>{
    this.logout();
  },duration * 1000)
 }

 private saveAuthData(token: string, expirationDate:Date,userId: string){
  localStorage.setItem('token',token);
  localStorage.setItem('expiration', expirationDate.toISOString());
  localStorage.setItem("userId",userId);
 }

 private clearAuthData(){
  localStorage.removeItem("token");
  localStorage.removeItem("expiration");
  localStorage.removeItem("userID");
 }

 private getAtuthData(){
  const token: any = localStorage.getItem("token");
  const expirationDate: any=localStorage.getItem("expiration");
  const userId= localStorage.getItem("userId");
  if(!token || !expirationDate){
    return;
  }
  return{
    token: token,
    expirationDate: new Date(expirationDate)
  }
 }
}
