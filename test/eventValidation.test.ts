import { eventSchemas } from "../src/api/v1/validation/eventValidation";

describe("Event Creation Validation", () => {
    const schema = eventSchemas.create.body!;

    it("should reject a name too short", () => {
        const { error } = schema.validate({
            name: "CP",
            date: "2099-12-25T09:00:00.000Z",
            capacity: 50
        });

        expect(error?.details[0].message)
            .toBe('"name" length must be at least 3 characters long');
    });

    it("should reject a date from before today", () => {
        const { error } = schema.validate({
            name: "Test Event",
            date: "2025-12-25T09:00:00.000Z",
            capacity: 50
        });

        expect(error?.details[0].message)
            .toBe('"date" must be greater than "now"');
    });

    it("should reject a non-integer capacity", () => {
        const { error } = schema.validate({
            name: "Test Event",
            date: "2099-12-25T09:00:00.000Z",
            capacity: 50.5
        });

        expect(error?.details[0].message)
            .toBe('"capacity" must be an integer');
    });

    it("should reject a registration count that exceeds capacity", () => {
        const { error } = schema.validate({
            name: "Test Event",
            date: "2099-12-25T09:00:00.000Z",
            capacity: 50,
            registrationCount: 100
        });

        expect(error?.details[0].message)
            .toBe('"registrationCount" must be less than or equal to ref:capacity');
    });
});