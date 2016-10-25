


var input = ['AX', 'BY',  'AY', 'BY'];

function hasCommonLetter(str, word) {
    return word.split('').filter((e, i) => e !== str[i]).length < 2;
}


function doSomething(str, array, end) {

  var length = str.length;
  var substr = str.slice(length - 2, length);
  if (substr === end) {
    return str;
  }
  for (var i = 0; i <= array.length - 1; i++) {
    console.log('so', substr, end);
    if (hasCommonLetter(substr, array[i]) && substr !== array[i]) {
      console.log(substr, array[i]);
      if (substr === end) {
        return str;
      }
      str + ' ' + doSomething(array[i], array, end);
    }


  }

}


function main() {
  var start = input.shift();
  var end = input.shift();

  var res = doSomething(start, input, end);

  console.log('result', res);


}

main();
