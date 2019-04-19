export class HP {
    link: string = '';      //name and id gotten from link string
    source: string = '';    //if left blank, assumed to be lit
    date: string = '';      //YYYY-MM-DD
    tokotas: Tokota[];
    qual: number = 0;       //SK=1, UC=2, UC/S=3, C=4, C/S=5
    chibi: boolean = false;
    recol: boolean = false;
    bg: boolean = false;
    hs: number[] = [];      //id of tokos w/ hs
    fb: number[] = [];      //id of tokos w/ fb
    sheet: number = 0;      //multiplier for hp sheets
    ownwork: number = 0;    //non-com=2, collab=1
    handler: boolean = false;
    starter: number = 0;    //0=no starter, else starter: id number
    lore: string = '';      //''=no lore, else lore: description
    affil: number = 0;      //1=1, 2=2, 3+=3
    outfit: number[] = [];  //id of tokos both drawn with tack and having outfitted trait
    wc: TokoSpef;
    act: TokoSpef;          //val=1:hunt,val=2:fish,val=3:explore,val=4:cave,val=5:dive,val=6:breed,val=7:heal,val=8:rite,val=9:show
    quest: TokoSpef;
    count: number = 1;

    constructor() { }

}

export class Tokota {   //for all non-starter tokotas in an image
    id: number;
    comp: number = 0;       //1=1, 2=2, 3+=3
    QLn: number = 0;
    QLl: string = '';

    constructor() { }
}

export class TokoSpef {

    val: number = 0;
    ids: number[] = [];

    constructor() { }
}

/* tokotna hp calc includes:
   alpha
   superstar (i/ii)
   brother bear
   fun sized
   tribemate
   skunk companion

   animations
   crafts
*/