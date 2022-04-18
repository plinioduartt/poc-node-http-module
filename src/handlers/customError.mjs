function customError(status, message) {
  let _err = new Error(JSON.stringify({ error: { status, message } }));
  _err.status = status;
  throw _err;
}

export default customError;