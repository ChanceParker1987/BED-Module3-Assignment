import * as eventService from "../src/api/v1/services/eventService";
import * as firestoreRepository from "../src/api/v1/repositories/firestoreRepository";
import { Event } from "../src/api/v1/models/eventModel";

// Mock the Firestore repository
jest.mock("../src/api/v1/repositories/firestoreRepository");

describe("Event Service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should create an event successfully", async () => {
        // Arrange
        const mockEventData = {
            name: "Test Event",
            date: new Date("2027-12-25T09:00:00.000Z"),
            capacity: 100,
            registrationCount: 0,
            status: "active",
            category: "conference"
        };
        const mockDocumentId: string = "test-event-id";

        (firestoreRepository.createDocument as jest.Mock).mockResolvedValue(
            mockDocumentId
        );

        // Act
        const result: Event = await eventService.createEvent(mockEventData);

        // Assert
        expect(firestoreRepository.createDocument).toHaveBeenCalledWith(
            "events",
            expect.objectContaining({
                name: mockEventData.name,
                date: mockEventData.date,
                capacity: mockEventData.capacity,
                registrationCount: mockEventData.registrationCount,
                status: mockEventData.status,
                category: mockEventData.category,
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            })
        );
        expect(result.id).toBe(mockDocumentId);
        expect(result.name).toBe(mockEventData.name);
    });

    it("should delete an event successfully", async () => {
        // Arrange
        const mockDocumentId: string = "test-event-id";
        const mockEvent: Event = {
            id: mockDocumentId,
            name: "Test Event",
            date: new Date("2027-12-25T09:00:00.000Z"),
            capacity: 100,
            registrationCount: 0,
            status: "active",
            category: "conference",
            createdAt: new Date(),
            updatedAt: new Date(),
        }
        // jest.spyOn creates a mock for a specific method/function on an object, in our example the itemService
        jest.spyOn(eventService, "getEventById").mockResolvedValue(mockEvent);

        // jest.Mock replaces the auto-mocked version with our specific mocked implementation
        (firestoreRepository.deleteDocument as jest.Mock).mockResolvedValue(
            undefined
        );

        // Act
        await eventService.deleteEvent(mockDocumentId);

        // Assert
        expect(eventService.getEventById).toHaveBeenCalledWith(mockDocumentId);
        expect(firestoreRepository.deleteDocument).toHaveBeenCalledWith(
            "events",
            mockDocumentId
        );
    });
});