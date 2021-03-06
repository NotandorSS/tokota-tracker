export class Tracking {
  //optional keys
  doOver: {date: string, link: string, hierarchy: number|null} = {date: "", link: "", hierarchy: null};
  build: number = 0;      //0=toko(optional), 1=toki, 2=dire, 3=akota
  companions: string[] = []; 
  startSub: boolean = false;
  hierarchy = 1; //0=sub, 1=ave, 2=dom, 3=alpha
  aoas = 0; //0=none, 1=novice, 2=average, 3=excellent
  aoasdate = '';
  domdate = '';
  avedate = '';
  alphadate = '';
  bonds: number[] = [];
  hpTokens = 0;
  social = 0;
  constructor (public id: number, public male: boolean) {
  }
}