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
  R.compose(R.all(R.identity), R.juxt([R.gte(R.__, from), R.lte(R.__, to)]));
const isValid = R.allPass([isNumber, isBetween(2, 10)]);
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
const getResultAndLog = (writeLog) => R.pipe(getResult, R.tap(writeLog));
const getResultAndSuccess = (handleSuccess) =>
  R.pipe(getResult, handleSuccess);
const square = R.partialRight(Math.pow, [2]);

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
  R.pipe(
    R.tap(writeLog),
    R.ifElse(
      isValid,
      R.pipe(
        Math.round,
        R.tap(writeLog),
        R.pipe(
          convertToBin,
          R.andThen(
            R.pipe(
              getResultAndLog(writeLog),
              R.tap((x) => writeLog(x.length)),
              square,
              R.tap(console.log),
              R.tap(writeLog),
              R.modulo(R.__, 3),
              R.tap(writeLog),
              R.pipe(
                getAnimal,
                R.otherwise(handleError),
                R.andThen(getResultAndSuccess(handleSuccess))
              )
            )
          ),
          R.otherwise(handleError)
        )
      ),
      () => handleError('ValidationError')
    )
  )(value);
};

export default processSequence;
