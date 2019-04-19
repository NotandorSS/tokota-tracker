export class HP_Card {
    link: string;
    source: string;
    name: string;
    total: number = 0;
    breakdown: string = 'breakdown';
    constructor (l: string, s: string, n: string) {
        this.link = l;
        this.source = s;
        this.name = n;
    }
}