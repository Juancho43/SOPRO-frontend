export interface GoogleUser {
    uid: string;
    email: string;
    nombre?: string;
    fotoUrl?: string;
    fechaCreacion: Date;
    ultimaConexion: Date;
    token?: string;
}