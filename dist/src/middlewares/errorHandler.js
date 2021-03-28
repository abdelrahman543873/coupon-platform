// This function is the error handler for the server,
// its invoked when next(err) called.
function errorHandling(err, req, res, next) {
  console.log(err);

  if (err.code == 11000) {
    return res.send({
      isSuccessed: false,
      data: null,
      error: err
    });
  }

  if (err.output.statusCode >= 500) {
    console.log(err); // supposed to be in the error loging file

    return res.status(err.output.statusCode).send({
      isSuccessed: false,
      data: null,
      error: "Its not you, its us, we are working on fixing it :("
    });
  }

  return res.status(err.output.statusCode).send({
    isSuccessed: false,
    data: null,
    error: err.output.payload.message
  });
}

export { errorHandling };