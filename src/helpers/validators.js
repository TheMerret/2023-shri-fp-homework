/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import * as R from 'ramda';
import { COLORS, SHAPES } from '../constants';

const getStar = R.prop(SHAPES.STAR);
const getSquare = R.prop(SHAPES.SQUARE);
const getTriangle = R.prop(SHAPES.TRIANGLE);
const getCircle = R.prop(SHAPES.CIRCLE);

const isWhite = R.equals(COLORS.WHITE);
const isNotWhite = R.compose(R.not, isWhite);
const isBlue = R.equals(COLORS.BLUE);
const isGreen = R.equals(COLORS.GREEN);
const isOrange = R.equals(COLORS.ORANGE);
const isRed = R.equals(COLORS.RED);

const getLengthFilteredValues = (predicate) =>
  R.compose(R.length, R.filter(predicate), R.values);

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = R.allPass([
  R.compose(isRed, getStar),
  R.compose(isGreen, getSquare),
  R.compose(isWhite, getCircle),
  R.compose(isWhite, getTriangle),
]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = R.compose(
  R.gte(R.__, 2),
  getLengthFilteredValues(isGreen)
);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = R.converge(R.equals, [
  getLengthFilteredValues(isRed),
  getLengthFilteredValues(isBlue),
]);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = R.allPass([
  R.compose(isBlue, getCircle),
  R.compose(isRed, getStar),
  R.compose(isOrange, getSquare),
]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = R.compose(
  R.gte(R.__, 3),
  R.reduce(R.max, 0),
  R.values,
  R.countBy(R.identity),
  R.filter(isNotWhite),
  R.values
);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = R.allPass([
  R.compose(R.equals(2), getLengthFilteredValues(isGreen)),
  R.compose(isGreen, getTriangle),
  R.compose(R.equals(1), getLengthFilteredValues(isRed)),
]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = R.all(isOrange);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = R.not(
  R.anyPass([R.compose(isRed, getStar), R.compose(isWhite, getStar)])
);

// 9. Все фигуры зеленые.
export const validateFieldN9 = R.all(isGreen);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = R.allPass([
  R.compose(isNotWhite, getTriangle),
  R.converge(R.equals, [getTriangle, getSquare]),
]);
