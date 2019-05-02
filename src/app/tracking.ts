export class Tracking {
  //required keys
  //optional keys
  doOver: {[k: string]: string} = {};
  build: number = 0;      //0=toko(optional), 1=toki, 2=dire, 3=akota
  companions: string[] = []; 
  startSub: boolean = false;
  hierarchy = 1; //0=sub, 1=ave, 2=dom, 3=alpha
  aoas = 0; //0=none, 1=novice, 2=average, 3=excellent
  aoasdate = '';
  domdate = '';
  bonds: number[] = [];
  HPcount: number = 0;
  constructor (public id: number, public male: boolean) {
  }
}