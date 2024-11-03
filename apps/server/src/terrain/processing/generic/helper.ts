export function deg2rad(degree: number): number {
  return degree * (Math.PI / 180.0);
}

export function rad2deg(radian: number): number {
  return radian * (180.0 / Math.PI);
}

export function distanceWgs84(latitude0: number, longitude0: number, latitude1: number, longitude1: number): number {
  const deltaLatitude = deg2rad(latitude1 - latitude0);
  const deltaLongitude = deg2rad(longitude1 - longitude0);
  const latitude0radian = deg2rad(latitude0);
  const latitude1radian = deg2rad(latitude1);

  const a =
    0.5 -
    Math.cos(deltaLatitude) * 0.5 +
    Math.cos(latitude0radian) * Math.cos(latitude1radian) * (1.0 - Math.cos(deltaLongitude)) * 0.5;

  const distanceMetres = 12742020.0 * Math.asin(Math.sqrt(a));
  return distanceMetres * 0.000539957;
}

export function degreesPerPixel(
  southwestLatitude: number,
  southwestLongitude: number,
  northeastLatitude: number,
  northeastLongitude: number,
  currentLatitude: number,
  mapWidth: number,
  mapHeight: number,
): [number, number] {
  let latStep = 0.0;
  if (southwestLatitude >= currentLatitude) {
    // we are at the south pole
    latStep = southwestLatitude + northeastLatitude + 180.0;
  } else if (northeastLatitude <= currentLatitude) {
    // we are at the north pole
    latStep = 180.0 - southwestLatitude - northeastLatitude;
  } else {
    latStep = northeastLatitude - southwestLatitude;
  }
  latStep /= mapHeight;

  // get the longitudinal step and check for 180 deg wrap arounds
  let longStep = 0.0;
  if (northeastLongitude < southwestLongitude) {
    longStep = 180.0 - southwestLongitude + Math.abs(northeastLongitude + 180.0);
  } else {
    longStep = northeastLongitude - southwestLongitude;
  }
  longStep /= mapWidth;

  return [latStep, longStep];
}

export function fastFlatten<T>(arr: T[][]): T[] {
  const numElementsUptoIndex = Array(arr.length);
  numElementsUptoIndex[0] = 0;
  for (let i = 1; i < arr.length; i++) {
    numElementsUptoIndex[i] = numElementsUptoIndex[i - 1] + arr[i - 1].length;
  }
  const flattened = new Array(numElementsUptoIndex[arr.length - 1] + arr[arr.length - 1].length);
  let skip;
  for (let i = 0; i < arr.length; i++) {
    skip = numElementsUptoIndex[i];
    for (let j = 0; j < arr[i].length; j++) {
      flattened[skip + j] = arr[i][j];
    }
  }
  return flattened;
}
