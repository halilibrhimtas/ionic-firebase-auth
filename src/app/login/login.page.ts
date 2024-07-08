import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleAuth, User } from '@codetrix-studio/capacitor-google-auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { isPlatform } from '@ionic/angular';
import { GoogleAuthProvider } from '@firebase/auth';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(public readonly auth: AngularFireAuth, private router: Router) {
    if(!isPlatform('capacitor')) {
      GoogleAuth.initialize();
    }
    firstValueFrom(this.auth.authState).then(user=>{
      console.log(JSON.stringify(user));
      if(user != null && typeof user != 'undefined') {
        console.log("User is logged in, go to home");
        console.log(JSON.stringify(user));
        this.router.navigateByUrl("/tabs/tab1");
      } else {
        console.log("User is not logged in");
      }
    }).catch(error=>{
      console.log("User state could not be checked");
    });
   }

  ngOnInit() {
  }

  loginWithGoogle() {
    console.log("loginWithGoogle is called");
    GoogleAuth.signIn().then((res) => {
      console.log("User logged in with Google");
      console.log(JSON.stringify(res));

      this.auth.signInWithCredential(GoogleAuthProvider.credential(res.authentication.idToken)).then(success => {
        console.log("Firebase success with Google login: " + JSON.stringify(success));
        this.router.navigateByUrl("/tabs/tab1");
      }).catch(error => {
        console.log("Google login didnt work");
      });
    }).catch((error:any) => {
      console.log("Google signin didnt work");
      console.log(error);
    });
  }

}
