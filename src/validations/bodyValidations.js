/* eslint-disable no-useless-escape */
import Joi from 'joi';

const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.,_]).{8,}$/;
const dateRegex = /^(0?[1-9]|[12][0-9]|3[01])[\/](0?[1-9]|1[012])$/;

const signUpSchema = Joi.object().length(3).keys({
  name: Joi.string().min(1).max(30).required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
  password: Joi.string().pattern(passwordRegex).required(),
});

const signInSchema = Joi.object().length(2).keys({
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
  password: Joi.string().pattern(passwordRegex).required(),
});

const newRecordSchema = Joi.object().length(4).keys({
  date: Joi.string().pattern(dateRegex).required(),
  description: Joi.string().min(1).max(300).required(),
  value: Joi.number().positive().invalid(0).required(),
  isAddRecord: Joi.valid(true).valid(false).required(),
});

export {
  signUpSchema,
  signInSchema,
  newRecordSchema,
};
