import {
    QuerySnapshot,
    DocumentData,
    DocumentSnapshot,
} from "firebase-admin/firestore";
import { Event } from "../models/eventModel";
import {
    createDocument,
    getDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument,
} from "../repositories/firestoreRepository";

// reference to the firestore collection name
const COLLECTION: string = "events";

/**
 * Retrieves all events from storage
 * @returns Array of all events
 */
export const getAllEvents = async (): Promise<Event[]> => {
    try {
        const snapshot: QuerySnapshot = await getDocuments(COLLECTION);
        const events: Event[] = snapshot.docs.map((doc) => {
            const data: DocumentData = doc.data();
            return {
                ...data,
                id: doc.id,
                date: data.date.toDate(),
                createdAt: data.createdAt.toDate(),
                updatedAt: data.updatedAt.toDate(),
            } as Event;
        });

        return events;
    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Creates a new event
 * @param eventData - The data for the new event
 * @returns The created event with generated ID
 */
export const createEvent = async (eventData: {
    name: string;
    date: Date;
    capacity: number;
    registrationCount: number;
    status: string;
    category: string;
}): Promise<Event> => {
    const dateNow = new Date();
    const newEvent: Partial<Event> = {
        ...eventData,
        createdAt: dateNow,
        updatedAt: dateNow,
    };

    const eventID: string = await createDocument<Event>(COLLECTION, newEvent);

    return structuredClone({ id: eventID, ...newEvent } as Event);
};

/**
 * Retrieves a single event by ID from the database
 * @param id - This ID of the event to retrieve
 * @returns The event if found
 */
export const getEventById = async (id: string): Promise<Event> => {
    const doc: DocumentSnapshot | null = await getDocumentById(COLLECTION, id);

    if (!doc || !doc.exists) {
        throw new Error(`Event with ID ${id} not found`);
    }

    const data = doc.data();

    if (!data) {
        throw new Error(`Event with ID ${id} has no data`);
    }
    const event: Event = {
        ...data,
        id: doc.id,
        date: data.date.toDate(),
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
    } as Event;

    return structuredClone(event);
};

/**
 * Updates (replaces) an existing event
 * @param id - The ID of the event to update
 * @param eventData - The fields to updates 
 * @returns The updated event
 * @throws Error if event with given ID is not found
 */
export const updateEvent = async (
    id: string,
    eventData: Partial<
        Pick<Event, "name" | "date" | "capacity" | "registrationCount" | "status" | "category">
    >
): Promise<Event> => {
    // check if the event exists before updating
    const event: Event = await getEventById(id);
    if (!event) {
        throw new Error(`Event with ID ${id} not found`);
    }

    const updatedEvent: Event = {
        ...event,
        updatedAt: new Date(),
    };

    if (eventData.name !== undefined) 
        updatedEvent.name = eventData.name;
    if (eventData.date !== undefined)
        updatedEvent.date = eventData.date;
    if (eventData.capacity !== undefined)
        updatedEvent.capacity = eventData.capacity;
    if (eventData.registrationCount !== undefined) 
        updatedEvent.registrationCount = eventData.registrationCount;
    if (eventData.status !== undefined) 
        updatedEvent.status = eventData.status;
    if (eventData.category !== undefined) 
        updatedEvent.category = eventData.category;
    if (updatedEvent.registrationCount > updatedEvent.capacity) {
    throw new Error("Registration count cannot exceed event capacity");
    }

    await updateDocument<Event>(COLLECTION, id, updatedEvent);

    return structuredClone(updatedEvent);
};

/**
 * Deletes an event from storage
 * @param id - The ID of the event to delete
 * @throws Error if event with given ID is not found
 */
export const deleteEvent = async (id: string): Promise<void> => {
    // check if the event exists before deleting
    const event: Event = await getEventById(id);
    if (!event) {
        throw new Error(`Event with ID ${id} not found`);
    }

    await deleteDocument(COLLECTION, id);
};
