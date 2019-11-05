const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateNewVote(data) {
    var errors = [];
    console.log(data);

    if (Validator.isEmpty(data.question)) {
        errors.push("Question is not valid");
    }

    if (Object.keys(data.options).length === 0) {
        errors.push("You can not create a vote without any options.");
    } else {
        for (let i = 0; i < data.options; i++) {
            if (Validator.isEmpty(data.options[i].name) || Validator.isEmpty(data.options[i].desc)) {
                errors.push("Every field of your options must be filled in.");
            }
        }
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
}

