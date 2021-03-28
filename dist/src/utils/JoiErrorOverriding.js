function errorsOverride(errors) {
  errors.forEach(err => {
    switch (err.code) {
      case "string.empty":
        err.message = `${err.local.key} should not be empty!`;
        break;

      case "string.email":
        err.message = `${err.local.key} must be a valid!`;
        break;

      case "any.required":
        err.message = `${err.local.key}  is required!`;
        break;

      case "any.invalid":
        err.message = `${err.local.key}  have invalide value!`;
        break;

      case "string.min":
        err.message = `${err.local.key} should have at least ${err.local.limit} characters!`;
        break;

      case "string.max":
        err.message = `${err.local.key} should have at most ${err.local.limit} characters!`;
        break;

      case "string.alphanum":
        err.message = `${err.local.key} must only contain alpha-numeric characters!`;
        break;

      default:
        break;
    }
  });
  return errors;
}

export { errorsOverride };