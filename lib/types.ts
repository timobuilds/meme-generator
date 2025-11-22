export interface TextState {
  text: string;
  fontSize: number;
  x: number;
  y: number;
  textColor: string;
  borderColor: string;
}

export interface Meme {
  id: string;
  userId: string;
  userName: string;
  imageData: string; // base64
  topText: string;
  bottomText: string;
  textState: {
    top: TextState;
    bottom: TextState;
  };
  createdAt: number;
  upvoteUserIds: string[];
}

export interface Schema {
  memes: {
    id: Meme;
  };
}

