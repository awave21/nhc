const STORAGE_KEY = 'dialogi.threadBanner.dismissed.v1';

export type DialogiBannerDismissed = Record<
    string,
    { appeal?: string; order?: string }
>;

export function readDialogiBannerDismissed(): DialogiBannerDismissed {
    if (typeof window === 'undefined') {
        return {};
    }

    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return {};
        }

        const parsed: unknown = JSON.parse(raw);

        if (!parsed || typeof parsed !== 'object') {
            return {};
        }

        return parsed as DialogiBannerDismissed;
    } catch {
        return {};
    }
}

export function writeDialogiBannerDismissed(
    value: DialogiBannerDismissed,
): void {
    if (typeof window === 'undefined') {
        return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}
