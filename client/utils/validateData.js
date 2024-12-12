const validate = (data, schema) => {
  try {
    schema.parse(data);
    return true;
  } catch (err) {
    const error = new Error(err.errors[0].message);
    error.code = 400; 
    throw error;
  }
};

module.exports = validate;
