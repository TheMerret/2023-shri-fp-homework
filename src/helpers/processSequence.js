/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import * as R from 'ramda';

import Api from '../tools/api';

const api = new Api();

const isNumber = R.test(/^(?=.)(([0-9]*)(\.([0-9]+))?)$/gm);
const isBetween = (from, to) =>
  R.compose(R.all(R.identity), R.juxt([R.gt(R.__, from), R.lt(R.__, to)]));
const isLengthValid = R.compose(isBetween(2, 10), R.length);
const isValid = R.allPass([isNumber, isLengthValid]);

const apiGet = R.curry(api.get);
const getBase = apiGet('https://api.tech/numbers/base');
const getAnimal = (id) => apiGet(`https://animals.tech/${id}`)({});
const getResult = R.prop('result');
const convertToBin = (number) =>
  getBase({
    from: 10,
    to: 2,
    number: `${number}`,
  });

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
  const throwValidationError = R.partial(handleError, ['ValidationError']);

  const logAndPass = R.tap(writeLog);
  const logLengthAndPass = R.pipe(R.length, logAndPass);

  const getResultAndSuccess = R.pipe(getResult, handleSuccess);
  const square = R.partialRight(Math.pow, [2]);

  const processAnimal = R.pipe(
    getAnimal,
    R.otherwise(handleError),
    R.andThen(getResultAndSuccess)
  );
  const processBin = R.pipe(
    getResult,
    logAndPass,
    logLengthAndPass,
    square,
    R.tap(console.log),
    logAndPass,
    R.modulo(R.__, 3),
    logAndPass,
    processAnimal
  );
  const processNumber = R.pipe(
    Math.round,
    logAndPass,
    convertToBin,
    R.andThen(processBin),
    R.otherwise(handleError)
  );

  const app = R.pipe(
    logAndPass,
    R.ifElse(isValid, processNumber, throwValidationError)
  );

  return app(value);
};

export default processSequence;
