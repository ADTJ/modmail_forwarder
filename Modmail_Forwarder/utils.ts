declare global {
    const utils: typeof Utils.utils;
}

export module Utils {

    export function utils(obj: number | NumberConstructor): typeof NumberUtils;
    export function utils(obj: any): any;
    export function utils(obj) {
        if (obj === Number || typeof obj === 'number')
            return Utils.NumberUtils;
    }

    export module NumberUtils {
        /**
         * Returns a boolean indicating whether the given value falls within the given bounds
         * @param value The value to be compared
         * @param lowerBound The lower bound of the comparison
         * @param upperBound The upper bound of the comparison
         * @param param3 Additional options for the comparison
         */
        export function between(value: number, lowerBound: number, upperBound: number, { lowerInclusive = true, upperInclusive = false } = {} as {
            /** Indicates whether the result should be true if the value is equal to the lower bound (defaults to true) */lowerInclusive: boolean;
            /** Indicates whether the result should be true if the value is equal to the upper bound (defaults to false)*/upperInclusive: boolean;
        }) {
            if (value === lowerBound && lowerInclusive)
                return true;
            else if (value > lowerBound && value < upperBound)
                return true;
            else if (value === upperBound && upperInclusive)
                return true;

            return false;
        }
    }
}

Object.assign(global, { utils: Utils.utils });