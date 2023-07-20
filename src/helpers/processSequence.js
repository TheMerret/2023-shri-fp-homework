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
import Api from '../tools/api';

const api = new Api();

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
  writeLog(value);

  const NUMBER_REGEX = /^(?=.)(([0-9]*)(\.([0-9]+))?)$/gm;

  const isNumber = NUMBER_REGEX.test(value);
  if (!(isNumber && 2 <= value.length && value.length <= 10)) {
    handleError('ValidationError');
    return;
  }
  const number = Math.round(+value);
  writeLog(number);
  const bin = api
    .get('https://api.tech/numbers/base', {
      from: 2,
      to: 10,
      number: `${number}`,
    })
    .then(({ result }) => {
      writeLog(result);
      return result;
    });
  writeLog(bin.length);
  const squared = number ** 2;
  writeLog(squared);
  const remaining = squared % 3;
  writeLog(remaining);
  api.get(`https://animals.tech/${remaining}`, {}).then(({ result }) => {
    handleSuccess(result);
  });
};

export default processSequence;
