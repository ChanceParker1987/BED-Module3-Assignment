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