describe('validatorTest', function() {

  beforeEach(module('validator'));

  var validationService;
  beforeEach(inject(function (_validationService_) {
    validationService=_validationService_;
  }));

  it('if username is less than 5 characters', function() {
    var formData={username:'1234',password:'12345678',password2:'12345678'};
    var result=validationService.signUp(formData);
    expect(result.isValid).toBe(false);
  });
  it('if username is greater than equal to 5 characters', function() {
    var formData={username:'12345',password:'12345678',password2:'12345678'};
    var result=validationService.signUp(formData);
    expect(result.isValid).toBe(true);
  });
  it('if password is less than 8 characters', function() {
    var formData={username:'12345',password:'1234567',password2:'12345678'};
    var result=validationService.signUp(formData);
    expect(result.isValid).toBe(false);
  });
  it('if password is greater than equal to 8 characters', function() {
    var formData={username:'12345',password:'12345678',password2:'12345678'};
    var result=validationService.signUp(formData);
    expect(result.isValid).toBe(true);
  });
  it('if password and password2 are not equal', function() {
    var formData={username:'12345',password:'12345678',password2:'12345687'};
    var result=validationService.signUp(formData);
    expect(result.isValid).toBe(false);
  });
  it('if password and password2 are equal', function() {
    var formData={username:'12345',password:'12345678',password2:'12345678'};
    var result=validationService.signUp(formData);
    expect(result.isValid).toBe(true);
  });

});
