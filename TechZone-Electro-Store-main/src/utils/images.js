export const optimizeImageUrl = (url, width = 640, quality = 72) => {
    if (!url || typeof url !== 'string') return url;

    try {
        const parsed = new URL(url);
        if (!parsed.hostname.includes('images.unsplash.com')) return url;

        parsed.searchParams.set('auto', 'format');
        parsed.searchParams.set('fit', 'crop');
        parsed.searchParams.set('w', String(width));
        parsed.searchParams.set('q', String(quality));
        return parsed.toString();
    } catch {
        return url;
    }
};
