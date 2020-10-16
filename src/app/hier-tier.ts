import { HP_Card } from './hp-card';

export class Hier_Tier {
    total: number = 0;
    spill: number = 0;
    cards: HP_Card[] = [];

    constructor(public name: string, public req: number){ }
}