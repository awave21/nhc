/**
 * Сравнение ISO-моментов по числовому времени (устойчиво к вариациям строки ISO).
 */
export function compareDialogiInstants(
    a: string | null,
    b: string | null,
): number {
    if (a === b) {
        return 0;
    }

    if (!a) {
        return 1;
    }

    if (!b) {
        return -1;
    }

    const na = Date.parse(a);
    const nb = Date.parse(b);

    if (!Number.isNaN(na) && !Number.isNaN(nb)) {
        if (na < nb) {
            return -1;
        }

        if (na > nb) {
            return 1;
        }

        return 0;
    }

    return a.localeCompare(b);
}
