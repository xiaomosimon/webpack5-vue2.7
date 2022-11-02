const arrayPush = Array.prototype.push;

export function pushArray<T>(source: Array<T>, newArray: Array<T>): void;

export function pushArray<T>(source: Array<T>, newArray: Array<T>) {
  arrayPush.apply(source, newArray);
}
