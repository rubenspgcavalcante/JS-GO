objectEquals = function(obj1, obj2) {
  var index;
  for(index in obj1) {
      if(typeof(obj2[index])=='undefined') {return false;}
  }

  for(index in obj1) {
      if (obj1[index]) {
          switch(typeof(obj1[index])) {
              case 'object':
                  if (!obj1[index].equals(obj2[index])) { return false; } break;
              case 'function':
                  if (typeof(obj2[index])=='undefined' ||
                      (index != 'equals' && obj1[index].toString() != obj2[index].toString()))
                      return false;
                  break;
              default:
                  if (obj1[index] != obj2[index]) { return false; }
          }
      } else {
          if (obj2[index])
              return false;
      }
  }

  for(index in obj2) {
      if(typeof(obj1[index])=='undefined') {return false;}
  }

  return true;
}

module.exports = objectEquals;