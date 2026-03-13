const API_BASE = 'http://localhost:3000/api';

/* ─── DOM helpers ─────────────────────────────────────────── */

function getEl(id) { return document.getElementById(id); }

function setFieldError(fieldId, errId, message) {
  const el = getEl(fieldId);
  el.classList.add('error');
  el.classList.remove('valid');
  getEl(errId).textContent = message;
}

function setFieldValid(fieldId, errId) {
  const el = getEl(fieldId);
  el.classList.remove('error');
  el.classList.add('valid');
  getEl(errId).textContent = '';
}

function clearFieldState(fieldId, errId) {
  const el = getEl(fieldId);
  el.classList.remove('error', 'valid');
  if (errId) getEl(errId).textContent = '';
}

/* ─── Error ↔ DOM field mapping ──────────────────────────── */

const FIELD_MAP = [
  { field: 'firstName',     err: 'firstNameErr'  },
  { field: 'lastName',      err: 'lastNameErr'   },
  { field: 'dob',           err: 'dobErr'        },
  { field: 'placeOfBirth',  err: 'pobErr'        },
  { field: 'nationality',   err: 'nationalityErr'},
  { field: 'maritalStatus', err: 'maritalErr'    },
  { field: 'settlementCamp',err: 'campErr'       },
  { field: 'joinDate',      err: 'joinDateErr'   },
];

/* ─── Display validation errors on the form ─────────────── */

function applyErrors(errors) {
  FIELD_MAP.forEach(({ field, err }) => {
    if (errors[field]) {
      setFieldError(field, err, errors[field]);
    } else {
      setFieldValid(field, err);
    }
  });
}

/* ─── Collect form values ────────────────────────────────── */

function collectFormData() {
  return {
    firstName:     getEl('firstName').value,
    lastName:      getEl('lastName').value,
    dob:           getEl('dob').value,
    placeOfBirth:  getEl('placeOfBirth').value,
    gender:        document.querySelector('input[name="gender"]:checked')?.value || 'female',
    nationality:   getEl('nationality').value,
    maritalStatus: getEl('maritalStatus').value,
    settlementCamp:getEl('settlementCamp').value,
    joinDate:      getEl('joinDate').value,
  };
}

/* ─── Reset form to defaults ─────────────────────────────── */

function resetForm() {
  getEl('firstName').value     = '';
  getEl('lastName').value      = '';
  getEl('dob').value           = '';
  getEl('placeOfBirth').value  = '';
  getEl('joinDate').value      = '';

  ['nationality', 'maritalStatus', 'settlementCamp'].forEach(id => {
    getEl(id).value = '';
    getEl(id).classList.remove('selected', 'error', 'valid');
  });

  // Reset gender to Female (default)
  document.querySelectorAll('input[name="gender"]').forEach(r => {
    r.checked = r.value === 'female';
  });

  // Clear all error/valid states
  FIELD_MAP.forEach(({ field, err }) => clearFieldState(field, err));
}

/* ─── Submit handler ─────────────────────────────────────── */

async function handleSubmit() {
  const data = collectFormData();

  // Client-side validation
  const errors = Validation.validateRegistrationForm(data);

  if (Object.keys(errors).length > 0) {
    applyErrors(errors);
    return;
  }

  // All valid — send to backend
  try {
    const response = await fetch(`${API_BASE}/beneficiaries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      // Show success alert and reset visible field borders
      FIELD_MAP.forEach(({ field, err }) => clearFieldState(field, err));
      getEl('successAlert').classList.add('show');
    } else {
      // Server returned validation errors
      if (result.errors) {
        applyErrors(result.errors);
      } else {
        alert(result.message || 'Registration failed. Please try again.');
      }
    }
  } catch (err) {
    console.error('Submission error:', err);
    alert('Could not connect to the server. Please try again later.');
  }
}

/* ─── Close success alert ────────────────────────────────── */

function handleCloseAlert() {
  getEl('successAlert').classList.remove('show');
  resetForm();
}

/* ─── Live input: clear error when user starts typing ───── */

FIELD_MAP.forEach(({ field, err }) => {
  const el = getEl(field);
  if (!el) return;
  const eventType = (el.tagName === 'SELECT') ? 'change' : 'input';
  el.addEventListener(eventType, () => {
    if (el.tagName === 'SELECT') el.classList.add('selected');
    clearFieldState(field, err);
  });
});

/* ─── Wire up buttons ────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  getEl('registerBtn').addEventListener('click', handleSubmit);
  getEl('closeAlertBtn').addEventListener('click', handleCloseAlert);
});
