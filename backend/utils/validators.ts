
export const isValidUUID = (uuid: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
};

export const isValidPrice = (price: number): boolean => {
    return typeof price === 'number' && price >= 0;
};

export const isValidQuantity = (quantity: number): boolean => {
    return Number.isInteger(quantity) && quantity > 0;
};

export const validateStringLength = (str: string, min: number, max: number): boolean => {
    return typeof str === 'string' && str.length >= min && str.length <= max;
};
