
export type SourceDocument<T> = {
    data: string;
    segment: string;
    subsegment: string;
    metadata: T;
}

export type HotelSourceDocument = SourceDocument<{
    hotelName: string;
}>