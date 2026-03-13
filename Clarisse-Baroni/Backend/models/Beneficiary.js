const mongoose = require('mongoose');

const beneficiarySchema = new mongoose.Schema({
  firstName:     { type: String, required: true, minlength: 2, trim: true },
  lastName:      { type: String, required: true, minlength: 2, trim: true },
  dateOfBirth:   { type: Date, required: true },
  placeOfBirth:  { type: String, required: true, minlength: 2, trim: true },
  gender:        { type: String, enum: ['male', 'female'], default: 'female' },
  nationality:   { type: String, required: true, enum: ['Ugandan','Kenyan','Tanzanian','Burundian','Rwandese','Somali','South Sudanese'] },
  maritalStatus: { type: String, required: true, enum: ['Single','Married','Divorced','Widowed','Separated'] },
  settlementCamp:{ type: String, required: true, enum: ['Gulu settlement camp','Arua settlement camp','Mbarara settlement camp','Kasese settlement camp','Busia settlement camp','Mbale settlement camp','Kigezi settlement camp'] },
  joinDate:      { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Beneficiary', beneficiarySchema);
