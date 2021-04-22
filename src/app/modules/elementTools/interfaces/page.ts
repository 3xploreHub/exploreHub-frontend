export interface Page {
    _id:string;
    status: string;
    creator: string;
    pageType: string;
    hostTouristSpot: string;
    components: any[];
    services: any[];
    otherServices: any[];
    bookingInfo:any[];
    createdAt: any,
    initialStatus: string;
}
