import { expect, test } from "vitest";
import {
    formatMobileNumber,
    formatMobileWithCountryCode,
    isValidLocalNumber,
    truncateText
} from "../../composables/useUtils";

test("Returns trimmed text based on the specified length followed by 3 dots", () => {
    const text = "Rethink Customer Service";
    expect(truncateText(text, 8)).toBe("Rethink ...");
});

test("Returns string unchanged if the specified length is greater than the length of the string", () => {
    const text = "Rethink Customer Service";
    expect(truncateText(text, 50)).toBe("Rethink Customer Service");
});

test("Returns true for a valid local phone number", () => {
    const number = "233123456789";
    expect(isValidLocalNumber(number)).toBe(true);
});

test("Converts phone number starting with 0 to start with 233", () => {
    const number = "0123456789";
    const result = formatMobileWithCountryCode(number);
    expect(result).toBe("233123456789");
});

test("Returns the number unchanged if it is not 10 digits and does not start with 0", () => {
    const number = "1234";
    const result = formatMobileWithCountryCode(number);
    expect(result).toBe("1234");
});

test("Converts phone number starting with 233 to start with 0", () => {
    const number = "233123456789";
    const result = formatMobileNumber(number);
    expect(result).toBe("0123456789");
});

test("Converts phone number which is 9 digits and does not start with 0 to start with 0", () => {
    const number = "123456789";
    const result = formatMobileNumber(number);
    expect(result).toBe("0123456789");
});

test("Returns the number unchanged if it is not 12 digits and starts with 233 or if it is not 9 digits and does not start with 0", () => {
    const number = "3489834";
    const result = formatMobileNumber(number);
    expect(result).toBe("3489834");
});
