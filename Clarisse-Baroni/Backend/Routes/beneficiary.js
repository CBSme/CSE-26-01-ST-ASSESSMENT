const express = require('express');
const router = express.Router();
const Beneficiary = require('../models/Beneficiary');

/* ─── Helper: parse YYYY/MM/DD or YYYY-MM-DD into a Date ─── */

function parseDate(value) {
  if (!value) return null;
  const cleaned = String(value).replace(/\s/g, '');
  const parts = cleaned.split(/[\/\-]/);
  if (parts.length !== 3) return null;
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return null;
  const date = new Date(y, m - 1, d);
  if (
    date.getFullYear() !== y ||
    date.getMonth() !== m - 1 ||
    date.getDate() !== d
  )
    return null;
  return date;
}

/* ─── Server-side validation ─────────────────────────────── */

function validateBody(body) {
  const errors = {};
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const fn = String(body.firstName || '').trim();
  if (!fn) errors.firstName = 'This field is required';
  else if (fn.length < 2) errors.firstName = 'Invalid field';

  const ln = String(body.lastName || '').trim();
  if (!ln) errors.lastName = 'This field is required';
  else if (ln.length < 2) errors.lastName = 'Invalid field';

  const dob = parseDate(body.dob);
  if (!body.dob) errors.dob = 'This field is required';
  else if (!dob || dob >= today) errors.dob = 'Invalid field';

  const pob = String(body.placeOfBirth || '').trim();
  if (!pob) errors.placeOfBirth = 'This field is required';
  else if (pob.length < 2) errors.placeOfBirth = 'Invalid field';

  if (!body.nationality) errors.nationality = 'This field is required';
  if (!body.maritalStatus) errors.maritalStatus = 'This field is required';
  if (!body.settlementCamp) errors.settlementCamp = 'This field is required';

  const joinDate = parseDate(body.joinDate);
  if (!body.joinDate) errors.joinDate = 'This field is required';
  else if (!joinDate || joinDate <= today) errors.joinDate = 'Invalid field';

  return errors;
}

/* ─── POST /api/beneficiaries ────────────────────────────── */

router.post('/', async (req, res) => {
  const errors = validateBody(req.body);
  if (Object.keys(errors).length > 0) {
    return res.status(422).json({ success: false, errors });
  }

  try {
    const beneficiary = await Beneficiary.create({
      firstName: req.body.firstName.trim(),
      lastName: req.body.lastName.trim(),
      dateOfBirth: parseDate(req.body.dob),
      placeOfBirth: req.body.placeOfBirth.trim(),
      gender: req.body.gender || 'female',
      nationality: req.body.nationality,
      maritalStatus: req.body.maritalStatus,
      settlementCamp: req.body.settlementCamp,
      joinDate: parseDate(req.body.joinDate),
    });

    return res.status(201).json({
      success: true,
      message: 'Beneficiary registered successfully',
      data: beneficiary,
    });
  } catch (err) {
    console.error('DB error:', err);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
});

/* ─── GET /api/beneficiaries ─────────────────────────────── */

router.get('/', async (req, res) => {
  try {
    const beneficiaries = await Beneficiary.find().sort({ createdAt: -1 });
    return res.json({ success: true, data: beneficiaries });
  } catch (err) {
    console.error('DB error:', err);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
});

/* ─── GET /api/beneficiaries/:id ─────────────────────────── */

router.get('/:id', async (req, res) => {
  try {
    const beneficiary = await Beneficiary.findById(req.params.id);
    if (!beneficiary) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }
    return res.json({ success: true, data: beneficiary });
  } catch (err) {
    console.error('DB error:', err);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
