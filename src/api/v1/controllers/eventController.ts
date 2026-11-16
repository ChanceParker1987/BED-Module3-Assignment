import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../constants/httpConstants";
import * as eventService from "../services/eventService";
import { Event } from "../models/eventModel";
import { successResponse } from "../models/responseModel";

/**
 * Manages requests and responses to retrieve all Events
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const getAllEvents = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const events: Event[] = await eventService.getAllEvents();
        res.status(HTTP_STATUS.OK).json(
            successResponse(events, "Events successfully retrieved")
        );
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and responses to retrieve an events by ID
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const getEventById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = req.params.id as string;
        const event = await eventService.getEventById(id);

        res.status(200).json(
            successResponse(event, "Event retrieved successfully")
        );
    } catch (error: unknown) {
        if (error instanceof Error && error.message.includes("not found")) {
            res.status(404).json({ error: error.message });
            return;
        }
        next(error);
    }
};

/**
 * Manages requests, responses, and validation to create an Event
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const createEvent = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Extract only the fields we want (destructuring)
        const { name, date, capacity, registrationCount, status, category } = req.body;

        const newEvent: Event = await eventService.createEvent({
            name,
            date,
            capacity,
            registrationCount,
            status,
            category
        });
        res.status(HTTP_STATUS.CREATED).json(
            successResponse(newEvent, "Event created successfully")
        );
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and responses to update an Event 
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const updateEvent = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // const id: string = req.params.id as string;
        const id = req.params.id as string;

        // Extract update fields
        const { name, date, capacity, registrationCount, status,category } = req.body;

        // create the update event object with the fields to be updated
        const updatedEvent: Event = await eventService.updateEvent(id, {
            name,
            date,
            capacity,
            registrationCount,
            status,
            category
        });

        res.status(HTTP_STATUS.OK).json(
            successResponse(updatedEvent, "Event updated successfully")
        );
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and responses to delete an Event 
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const deleteEvent = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = req.params.id as string;
        await eventService.deleteEvent(id);

        res.status(200).json({
            message: "Event deleted successfully"
        });
    } catch (error: unknown) {
        if (error instanceof Error && error.message.includes("not found")) {
            res.status(404).json({ error: error.message });
            return;
        }
        next(error);
    }
};