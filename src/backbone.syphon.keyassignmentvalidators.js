// Key Assignment Validators
// -------------------------

// Key Assignment Validators are used to determine whether or not a
// key should be assigned to a value, after the key and value have been
// extracted from the element. This is the last opportunity to prevent
// bad data from getting serialized to your object.

var KeyAssignmentValidatorSet = Syphon.KeyAssignmentValidatorSet = TypeRegistry.extend();

// Build-in Key Assignment Validators
var KeyAssignmentValidators = Syphon.KeyAssignmentValidators = new KeyAssignmentValidatorSet();

// Everything is valid by default
KeyAssignmentValidators.registerDefault(function() {
  return true;
});

// But only the "checked" radio button for a given
// radio button group is valid
KeyAssignmentValidators.register('radio', function($el, key, value) {
  if ($el.prop('checked')) {
    return true;
  }

  // in case radio button is not checked return true if a value different than undefined
  // as been set.
  // This behavior is useful to set a default value for a radio group
  return value !== undefined;
});
