validator.factory('validationService', function() {
  var obj = {};
  return {
    signIn: function(formData) {
      obj.isValid = true;
      if (formData.username.length < 5) {
        obj.isValid = false;
        obj.warning = 'Username should be 5 characters minimum';
      } else if (formData.password.length < 8) {
        obj.isValid = false;
        obj.warning = 'Password should be 8 characters minimum';
      }
      return obj;
    },
    signUp: function(formData) {
      obj.isValid = true;
      if (this.signIn(formData).isValid && formData.password != formData.password2) {
        obj.isValid = false;
        obj.warning = 'Passwords don\'t match';
      }
      return obj;
    }
  };
});
