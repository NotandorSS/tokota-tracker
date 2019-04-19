import { HP_Card } from './hp-card';

export class Hier_Tier {
    name: string;
    req: number;
    total: number = 0;
    spill: number = 0;
    cards: HP_Card[] = [];

    constructor(n: string, r: number){
        this.name = n;
        this.req = r;
    }
}