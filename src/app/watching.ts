export class Watching {
    //required keys
    id: number;
    owner: string;
    //optional keys
    alpha: boolean;
    superstar: number;
    brother_bear: boolean;
    fun_sized: boolean;
    bonds: [];
  
    constructor (i: number, o: string) {
      this.id = i;
      this.owner = o;
    }
  }