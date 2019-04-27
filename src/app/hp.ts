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
        public wc: TokoSpef,
        public act: TokoSpef,     //1:hunt,2:fish,3:explore,4:cave,5:dive,6:breed,7:heal,8:rite,9:show,10:event
        public show: {[k: string]: Spef},  //show = {'123456': new Spef(123456, 3, 'link'), etc}
        //show - 1st, 2nd, 3rd places
        public quest: TokoSpef,
        public handler: boolean,
        public lore: string,      //''=no lore, else lore: description
        public companions: string[],
        public arpg: string[],    //array of links to arpg imports
        public QL: {[k: string]: Spef},  //QL = {'123456': new Spef(123456, 3, 'link'), etc}
    ) { }
}

export class Spef {
    constructor(public id: number, public val: number, public link: string) {}
}

export class TokoSpef {
    constructor(public val: number, public ids: number[]) {}
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