import { Injectable, inject,signal } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
} from '@angular/fire/auth';
import { AuthHTTP, User } from './auth-http';
import { GoogleUser } from './auth.model';
import { Router } from '@angular/router';
import { LocalStorage } from '../../../core/logic/local-storage';


@Injectable({
  providedIn: 'root',
})
export class AuthHelper {
  private apiCalls = inject(AuthHTTP)
  private auth = inject(Auth);
  private localStorage = inject(LocalStorage);
  private router = inject(Router);
  user = signal<User | null>(null)
isLoggedIn(): boolean {
    return !!this.localStorage.getValue(this.localStorage.TOKEN_KEY);
  }
getToken() : string | null{
  return this.localStorage.getValue(this.localStorage.TOKEN_KEY)
}
getUserId(): string | null {
  return this.localStorage.getValue(this.localStorage.USER_KEY)
}
  loginWithGoogle() {
    this.callFirebase().then(r => {
      if (r && r.token) {
        this.localStorage.deleteValue(this.localStorage.TOKEN_KEY)
        this.localStorage.deleteValue(this.localStorage.USER_KEY)
        this.apiCalls.loginWithGoogle(r.token).subscribe(res => {
          this.localStorage.saveValue(this.localStorage.TOKEN_KEY,r.token!)
          this.localStorage.saveValue(this.localStorage.USER_KEY, r.uid)
          this.user.set(res)
          this.router.navigateByUrl("/home")
        });
      }
    }).catch(error => {
      console.error("Error en la autenticación:", error);
    });
  }

  async callFirebase(): Promise<GoogleUser | null> {
    try {
      const proveedor = new GoogleAuthProvider();

      proveedor.addScope('email');
      proveedor.addScope('profile');

      const resultado = await signInWithPopup(this.auth, proveedor);

      const usuarioFirebase = resultado.user;
      const token = await usuarioFirebase.getIdToken()
      if (usuarioFirebase) {
        const usuario: GoogleUser = {
          uid: usuarioFirebase.uid,
          email: usuarioFirebase.email || '',
          nombre: usuarioFirebase.displayName || 'Usuario sin nombre',
          fotoUrl: usuarioFirebase.photoURL || undefined,
          fechaCreacion: new Date(),
          ultimaConexion: new Date(),
          token: token
        };

        return usuario;
      }

      return null;
    } catch (error) {
      console.error('❌ Error durante la autenticación:', error);
      throw error;
    }
  }

}
