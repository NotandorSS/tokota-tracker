export class Tracking {
  //required keys
  id: number;
  //optional keys
  doOver: string = '';
  build: number = 0;      //0=toko(optional), 1=toki, 2=dire, 3=akota
  companions: string[] = []; 
  startSub: boolean = false;
  sex: number = 0;        //0=female(optional), 1=male
  constructor (i: number) {
    this.id = i;
  }
}