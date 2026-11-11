import Joi from "joi";
import { RequestSchema } from "../middleware/validate";

/**
 * Event schema organised by request type
 */
export const eventSchemas: Record<string, RequestSchema> = {
    // POST /api/v1/events - Create new Event
    create: {
        body: Joi.object({
            name: Joi.string().min(3).required(),
            date: Joi.date().greater("now").required(),
            capacity: Joi.number().integer().min(5).required(),
            registrationCount: Joi.number().integer().min(0).max(Joi.ref("capacity")).default(0),
            status: Joi.string().valid("active", "cancelled", "completed").default("active"),
            category: Joi.string().valid("conference", "workshop", "meetup", "seminar", "general").default("general")
        }),
    },

    // PUT /api/v1/items/:id - Update Item
    update: {
        params: Joi.object({
            id: Joi.string().required(),
        }),
        body: Joi.object({
            name: Joi.string().optional(),
            description: Joi.string().optional().messages({
                "string.empty": "Description cannot be empty",
            }),
            price: Joi.number().optional().min(0).messages({
                "number.min": "Price must greater than 0",
            }),
        }),
    },
};
