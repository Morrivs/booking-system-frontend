export interface Booking {
    id: string;
    propertyId: number;
    userId: number;
    startDate: Date;
    endDate: Date;
    status: String;
}