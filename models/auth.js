const Joi = require("joi")

const validateUser = (user) => {
    const schema = Joi.object({
        mobileNumber: Joi.string().length(10).required(),
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        birthDate: Joi.date(),
        gender: Joi.string().valid("male", "female"),
        notify: Joi.boolean(),
    })

    return schema.validate(user)
}

exports.validate = validateUser