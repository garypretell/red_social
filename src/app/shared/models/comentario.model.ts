export interface Comentario {
    id?: number;
    parentId?: any;
    nickname: string;
    avatar: string;
    content: string;
    date: number;
    publicacionId?: any;
    child?: Array<Comentario>;
}