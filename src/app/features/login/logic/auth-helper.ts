import { Injectable, inject } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
} from '@angular/fire/auth';
import { AuthHTTP } from './auth-http';
import { GoogleUser } from './auth.model';
@Injectable({
  providedIn: 'root',
})
export class AuthHelper {
  private apiCalls = inject(AuthHTTP)
  private auth = inject(Auth);


  loginWithGoogle() {
    this.callFirebase().then(r => {
      if (r && r.token) {
        this.apiCalls.loginWithGoogle(r.token).subscribe(r => {

        alert("LISTO")
        console.log("listo",r)
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
