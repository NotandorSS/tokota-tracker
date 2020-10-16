export class HP {
    constructor(
        public link: string,
        public src: string,
        public name: string,
        public date: string,
        public tokos: number[],
        public artists: string[],
        public starter: number,
        public hs: number[],      //id of tokos that aren't fb
        public qual: number,      //SK=0, UC=1, UC/S=1.5, C=2, C/S=3
        public bg: boolean,
        public wc: ITokoSpef,
        public act: ITokoSpef,     //1:hunt,2:fish,3:explore,4:cave,5:dive,6:breed,7:heal,8:rite,9:show,10:event
        public show: {[id: string]: ISpef},  //show = {'123456': new Spef(123456, 3, 'link'), etc}
        //show - 1st, 2nd, 3rd places
        public quest: ITokoSpef,
        public handler: boolean,
        public lore: string,      //''=no lore, else lore: description
        public companions: string[],
        public arpg: string[],    //array of links to arpg imports
        public QL: {[id: string]: ISpef},  //QL = {'123456': new Spef(123456, 3, 'link'), etc}
    ) { }
}

interface ISpef {
    id: number,
    val: number,
    link: string
}

interface ITokoSpef {
    val: number,
    ids: number[]
}

/* features to be added later:
   chibi
   recol
   sheets
   prehistoric companions
   other places in show
   outfitted
   social
   skunk companion? Cause how does it work?
   animations
   crafts
*/