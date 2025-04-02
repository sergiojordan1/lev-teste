"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOver18 = void 0;
const isOver18 = (date) => {
    const today = new Date();
    const birthDate = new Date(date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age >= 18;
};
exports.isOver18 = isOver18;
