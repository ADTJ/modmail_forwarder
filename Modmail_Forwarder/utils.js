"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Utils;
(function (Utils) {
    function utils(obj) {
        if (obj === Number || typeof obj === 'number')
            return Utils.NumberUtils;
    }
    Utils.utils = utils;
    let NumberUtils;
    (function (NumberUtils) {
        /**
         * Returns a boolean indicating whether the given value falls within the given bounds
         * @param value The value to be compared
         * @param lowerBound The lower bound of the comparison
         * @param upperBound The upper bound of the comparison
         * @param param3 Additional options for the comparison
         */
        function between(value, lowerBound, upperBound, { lowerInclusive = true, upperInclusive = false } = {}) {
            if (value === lowerBound && lowerInclusive)
                return true;
            else if (value > lowerBound && value < upperBound)
                return true;
            else if (value === upperBound && upperInclusive)
                return true;
            return false;
        }
        NumberUtils.between = between;
    })(NumberUtils = Utils.NumberUtils || (Utils.NumberUtils = {}));
})(Utils = exports.Utils || (exports.Utils = {}));
Object.assign(global, { utils: Utils.utils });
//# sourceMappingURL=Utils.js.map