declare global {
    const utils: typeof Utils.utils;
    const wait: typeof waitFn;
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

function waitFn(waitMs: number): Promise<void>;
function waitFn<T>(callback: () => T, waitMs?: number): Promise<T>;
function waitFn<T>(param1: any, waitMs = 0): Promise<T> {
    let callback = null as () => T;
    if (typeof param1 === 'number') waitMs = param1;
    else callback = param1;

    return new Promise<T>((resolve, reject) => setTimeout(() => {
        try {
            resolve(callback?.());
        }
        catch (err) { reject(err); }
    }, waitMs));
}

Object.assign(global, {
    utils: Utils.utils,
    wait: waitFn
});