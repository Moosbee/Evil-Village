let now = new Date();

console.log(now);
console.log(now.getTime());
console.log(now.toISOString());
console.log(now.toUTCString());
console.log(now.toJSON());
console.log(now.toString());
console.log(now.toTimeString());

let late = new Date('2022-07-01T07:23:47.196Z');
console.log(late);
let later = late.getUTCDate();
let expirer: number = 24 * 60 * 60 * 1000;
let timeDiv = now.getTime() - late.getTime();
console.log(timeDiv);
if (timeDiv > expirer) {
  console.log('test');
} else {
  console.log('west');
}
