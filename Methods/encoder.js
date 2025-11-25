module.exports = (input) => {
    if (!input || typeof input !== "string") {
        throw new TypeError("encoder expects a string input");
    }

    const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    const hex = input.replace(/-/g, "");
    if (!/^[0-9a-fA-F]+$/.test(hex)) {
        throw new TypeError("encoder input must be a hex string or UUID-like string");
    }

    let num = BigInt("0x" + hex);
    if (num === 0n) {
        return chars[0].repeat(7);
    }

    const base = BigInt(chars.length);
    let encoded = "";
    while (num > 0n) {
        const rem = Number(num % base);
        encoded = chars[rem] + encoded;
        num = num / base;
    }

    if (encoded.length < 7) {
        encoded = chars[0].repeat(7 - encoded.length) + encoded;
    } else if (encoded.length > 7) {
        encoded = encoded.slice(-7);
    }

    return encoded;
};