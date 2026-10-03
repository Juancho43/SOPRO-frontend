import { Injectable, inject,signal } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
} from '@angular/fire/auth';
import { AuthHTTP, User } from './auth-http';
import { GoogleUser } from './auth.model';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class AuthHelper {
  private apiCalls = inject(AuthHTTP)
  private auth = inject(Auth);
   token = signal<string>('')
  user = signal<User | null>(null)
  private router = inject(Router);
  loginWithGoogle() {
    this.callFirebase().then(r => {
      if (r && r.token) {
        this.apiCalls.loginWithGoogle(r.token).subscribe(res => {
          this.token.set(r.token!)
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

      // Configuramos los scopes que queremos obtener del usuario
      proveedor.addScope('email');
      proveedor.addScope('profile');

      // Abrimos el popup de Google para autenticación
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
