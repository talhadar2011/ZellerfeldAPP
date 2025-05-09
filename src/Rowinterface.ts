export interface Row {
    oid: number;
    statusLeft: string;
    statusRight: string;
    type: string;
    lock: string;
    customer: string;
    daysSinceOrder: number;
    model: string;
    designer: string;
    [key: string]: string | number;
   }