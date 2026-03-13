const Validation = (() => {

  /**
   * Parse a date string in YYYY/MM/DD or YYYY-MM-DD format.
   * Returns a Date object or null if invalid.
   */
  function parseDate(value) {
    const cleaned = value.replace(/\s/g, '');
    const parts = cleaned.split(/[\/\-]/);
    if (parts.length !== 3) return null;
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const d = parseInt(parts[2], 10);
    if (isNaN(y) || isNaN(m) || isNaN(d)) return null;
    const date = new Date(y, m - 1, d);
    // Verify the date components match (catches impossible dates like Feb 30)
    if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) {
      return null;
    }
    return date;
  }

  /**
   * Validate a required text field with a minimum length of 2 characters.
   */
  function validateTextField(value) {
    const trimmed = value.trim();
    if (!trimmed) return { valid: false, message: 'This field is required' };
    if (trimmed.length < 2) return { valid: false, message: 'Invalid field' };
    return { valid: true, message: '' };
  }

  /**
   * Validate Date of Birth — must be a valid date before today.
   */
  function validateDOB(value) {
    const trimmed = value.trim();
    if (!trimmed) return { valid: false, message: 'This field is required' };
    const date = parseDate(trimmed);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (!date || date >= today) return { valid: false, message: 'Invalid field' };
    return { valid: true, message: '' };
  }

  /**
   * Validate Date of Joining Settlement Camp — must be after today (date of registration).
   */
  function validateJoinDate(value) {
    const trimmed = value.trim();
    if (!trimmed) return { valid: false, message: 'This field is required' };
    const date = parseDate(trimmed);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (!date || date <= today) return { valid: false, message: 'Invalid field' };
    return { valid: true, message: '' };
  }

  /**
   * Validate a required <select> field.
   */
  function validateSelect(value) {
    if (!value) return { valid: false, message: 'This field is required' };
    return { valid: true, message: '' };
  }

  /**
   * Validate the full registration form.
   * @param {Object} data - Form field values keyed by field name.
   * @returns {Object} errors - Object with field names as keys; empty if valid.
   */
  function validateRegistrationForm(data) {
    const errors = {};

    const fnResult = validateTextField(data.firstName);
    if (!fnResult.valid) errors.firstName = fnResult.message;

    const lnResult = validateTextField(data.lastName);
    if (!lnResult.valid) errors.lastName = lnResult.message;

    const dobResult = validateDOB(data.dob);
    if (!dobResult.valid) errors.dob = dobResult.message;

    const pobResult = validateTextField(data.placeOfBirth);
    if (!pobResult.valid) errors.placeOfBirth = pobResult.message;

    const natResult = validateSelect(data.nationality);
    if (!natResult.valid) errors.nationality = natResult.message;

    const marResult = validateSelect(data.maritalStatus);
    if (!marResult.valid) errors.maritalStatus = marResult.message;

    const campResult = validateSelect(data.settlementCamp);
    if (!campResult.valid) errors.settlementCamp = campResult.message;

    const joinResult = validateJoinDate(data.joinDate);
    if (!joinResult.valid) errors.joinDate = joinResult.message;

    return errors;
  }

  // Public API
  return {
    validateTextField,
    validateDOB,
    validateJoinDate,
    validateSelect,
    validateRegistrationForm,
    parseDate,
  };

})();