// Value Assigners
// -------------------------

// Value Assigners are used to  whether or not a
// key should be assigned to a value, after the key and value have been
// extracted from the element. This is the last opportunity to prevent
// bad obj[key] from getting serialized to your object.

var ValueAssignerSet = Syphon.ValueAssignerSet = TypeRegistry.extend();

// Build-in Key Assignment Values
var ValueAssigners = Syphon.ValueAssigners = new ValueAssignerSet();

// return value by default
ValueAssigners.registerDefault(function(value) {
  return function(obj, key) {
    if (_.isArray(obj[key])) {
      obj[key].push(value);
    } else {
      obj[key] = value;
    }
  };
});

// radio group button can have only one value assigned.
ValueAssigners.register('radio', function(value) {
  var emptyValueFn = function(value) {
    return _.isNull(value) || _.isUndefined(value) || _.isObject(value) && _.isEmpty(value);
  };

  return function(obj, key) {
    if (_.isArray(obj[key])) {
      if (!obj[key].length || (obj[key].length && emptyValueFn(obj[key][0]))) {
        obj[key] = [value];
      }
    } else {
      // default is initialized to {}
      if (emptyValueFn(obj[key])) {
        obj[key] = value;
      }
    }
  };
});
