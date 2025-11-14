export interface Drink {
  id: string;
  name: string;
  volume: number; // cl
  alcohol: number; // %
  time: Date;
}

export interface UserProfile {
  weight: number;
  height: number;
  gender: 'male' | 'female' | null;
}
