
export function generateSlug(name: string): string {
    if (!name) return '';
    return name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove non-word chars (except spaces and dashes)
        .replace(/\s+/g, '-');    // Replace spaces with dashes
}
