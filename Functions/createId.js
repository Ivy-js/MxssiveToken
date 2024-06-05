/**
 * 
 * @param {String} code Le précode (Ex : CODE-XXXX)
 * @param {Number} length La longueur de l'ID
 * @returns 
 */
function createID(code, length){
    let abc = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
    let id = [];

    for (let i = 0; i < length; i++) {
        id.push(abc[Math.floor(Math.random() * abc.length)]);
    }

    return `${code}-${id.join("")}`;
}

module.exports = { createID }