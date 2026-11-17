import * as eventService from "../src/api/v1/services/eventService";
import * as firestoreRepository from "../src/api/v1/repositories/firestoreRepository";
import { Event } from "../src/api/v1/models/eventModel";

// Mock the Firestore repository
jest.mock("../src/api/v1/repositories/firestoreRepository");

describe("Event Service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
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

    it("should retrieve all events successfully", async () => {
        // Arrange
        const mockDate = new Date("2027-12-25T09:00:00.000Z");
        const mockCreatedAt = new Date("2026-11-16T09:00:00.000Z");

        const mockSnapshot = {
            docs: [
                {
                    id: "test-event-id",
                    data: () => ({
                        name: "Test Event",
                        date: { toDate: () => mockDate },
                        capacity: 100,
                        registrationCount: 0,
                        status: "active",
                        category: "conference",
                        createdAt: { toDate: () => mockCreatedAt },
                        updatedAt: { toDate: () => mockCreatedAt }
                    })
                }
            ]
        };

        (firestoreRepository.getDocuments as jest.Mock)
            .mockResolvedValue(mockSnapshot);

        // Act
        const result: Event[] = await eventService.getAllEvents();

        // Assert
        expect(firestoreRepository.getDocuments)
            .toHaveBeenCalledWith("events");

        expect(result).toHaveLength(1);
        expect(result[0].id).toBe("test-event-id");
        expect(result[0].name).toBe("Test Event");
        expect(result[0].date).toEqual(mockDate);
    });

    it("should retrieve an event by ID successfully", async () => {
        // Arrange
        const mockDocumentId = "test-event-id";
        const mockDate = new Date("2027-12-25T09:00:00.000Z");
        const mockCreatedAt = new Date("2026-11-16T09:00:00.000Z");

        const mockDocument = {
            id: mockDocumentId,
            exists: true,
            data: () => ({
                name: "Test Event",
                date: { toDate: () => mockDate },
                capacity: 100,
                registrationCount: 0,
                status: "active",
                category: "conference",
                createdAt: { toDate: () => mockCreatedAt },
                updatedAt: { toDate: () => mockCreatedAt }
            })
        };

        (firestoreRepository.getDocumentById as jest.Mock)
            .mockResolvedValue(mockDocument);

        // Act
        const result: Event = await eventService.getEventById(mockDocumentId);

        // Assert
        expect(firestoreRepository.getDocumentById)
            .toHaveBeenCalledWith("events", mockDocumentId);

        expect(result.id).toBe(mockDocumentId);
        expect(result.name).toBe("Test Event");
        expect(result.date).toEqual(mockDate);
    });

    it("should update an event successfully", async () => {
        // Arrange
        const mockDocumentId = "test-event-id";
        const mockDate = new Date("2027-12-25T09:00:00.000Z");
        const mockCreatedAt = new Date("2026-11-16T09:00:00.000Z");

        const mockDocument = {
            id: mockDocumentId,
            exists: true,
            data: () => ({
                name: "Test Event",
                date: { toDate: () => mockDate },
                capacity: 100,
                registrationCount: 0,
                status: "active",
                category: "conference",
                createdAt: { toDate: () => mockCreatedAt },
                updatedAt: { toDate: () => mockCreatedAt }
            })
        };

        (firestoreRepository.getDocumentById as jest.Mock)
            .mockResolvedValue(mockDocument);

        (firestoreRepository.updateDocument as jest.Mock)
            .mockResolvedValue(undefined);

        // Act
        const result: Event = await eventService.updateEvent(
            mockDocumentId,
            { capacity: 150 }
        );

        // Assert
        expect(firestoreRepository.getDocumentById)
            .toHaveBeenCalledWith("events", mockDocumentId);

        expect(firestoreRepository.updateDocument).toHaveBeenCalledWith(
            "events",
            mockDocumentId,
            expect.objectContaining({
                capacity: 150,
                name: "Test Event",
                registrationCount: 0,
                updatedAt: expect.any(Date)
            })
        );

        expect(result.capacity).toBe(150);
        expect(result.name).toBe("Test Event");
        expect(result.createdAt).toEqual(mockCreatedAt);
        expect(result.updatedAt.getTime())
            .toBeGreaterThan(mockCreatedAt.getTime());
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