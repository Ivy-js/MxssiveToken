
function randomElo(multiplier = 1) {
    if (multiplier < 1 || multiplier > 2) {
        throw new Error("The multiplier must be between 1 and 2.");
    }

    const baseElo = Math.floor(Math.random() * 15) + 1;
    return baseElo * multiplier;
}

module.exports = { randomElo }