export interface notificationGroup {
    _id: string;
    receiver: any;
    initiator: any;
    page: any;
    booking: any;
    type: string;
    notifications: any[],
    createdAt: string;
    opened: boolean;
}