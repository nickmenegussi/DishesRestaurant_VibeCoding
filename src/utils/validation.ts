export const VALIDATION_REGEX = {
    // Alphanumeric with spaces, 3-50 chars
    DISH_NAME: /^[a-zA-Z0-9\s\-\']{3,50}$/,

    // Positive number with up to 2 decimal places
    PRICE: /^\d+(\.\d{1,2})?$/,

    // Min 10 chars, max 500
    DESCRIPTION: /^[\s\S]{10,500}$/,

    // Basic URL validation
    IMAGE_URL: /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i,

    // Slug: lowercase alphanumeric and hyphens
    SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
};

export const validateField = (value: string, type: keyof typeof VALIDATION_REGEX): string | null => {
    if (!value) return "This field is required";

    const regex = VALIDATION_REGEX[type];
    if (!regex.test(value)) {
        switch (type) {
            case 'DISH_NAME':
                return "Name must be 3-50 characters";
            case 'PRICE':
                return "Invalid price format";
            case 'DESCRIPTION':
                return "Description must be 10-500 characters";
            case 'IMAGE_URL':
                return "Invalid image URL (must end in .jpg, .png, etc)";
            case 'SLUG':
                return "Invalid slug format";
            default:
                return "Invalid format";
        }
    }
    return null;
};
