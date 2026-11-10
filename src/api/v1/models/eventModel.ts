/**
 * Represents an event in the system
 */
export interface Event {
    id: string;
    name: string;
    date: Date;
    capacity: number;
    registrationCount: number;
    status: string;
    category: string;
    createdAt: Date;
    updatedAt: Date;
}