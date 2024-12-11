const validate = (data, schema) => {
  try {
    schema.parse(data);

    return true;
  } catch (err) {
    throw new Error(err.errors[0].message);
  }
};

module.exports = validate;
