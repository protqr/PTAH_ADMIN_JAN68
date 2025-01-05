import mongoose from "mongoose";
import {
  TYPEPOSTURES,
  TYPESTATUS,
  GENDER,
  RELATIONS,
  HAVECAREGIVER,
} from "../utils/constants.js";

const PatientSchema = new mongoose.Schema(
  {
    idPatient: String, // หมายเลขผู้ป่วย
    idNumber: String, // หมายเลขบัตรประชาชน
    namePatient: String, // ชื่อผู้ป่วย
    lastnamePatient: String, // นามสกุลผู้ป่วย
    userGender: {
      type: String,
      enum: Object.values(GENDER),
      default: GENDER.GENDER_01,
    },
    userType: {
      type: String,
      enum: Object.values(TYPEPOSTURES),
      default: TYPEPOSTURES.TYPE_1,
    },
    sickness: String, // อาการของผู้ป่วย
    userPosts: String, // ท่ากายภาพบำบัดที่เลือก
    userStatus: {
      type: String,
      enum: Object.values(TYPESTATUS),
      default: TYPESTATUS.TYPE_ST1,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User", // ผู้ใช้งานที่สร้างข้อมูลนี้
    },
    isDeleted: {
      type: Boolean,
      default: false, // ระบุว่าลบข้อมูลแล้วหรือไม่
    },
    // ข้อมูลผู้ดูแล
    youhaveCaregiver: {
      type: String,
      enum: Object.values(HAVECAREGIVER),
      default: HAVECAREGIVER.TYPE_CGV1,
    },
    nameCaregiver: String, // ชื่อผู้ดูแล
    lastnameCaregiver: String, // นามสกุลผู้ดูแล
    telCaregiver: String, // เบอร์โทรผู้ดูแล
    caregiverRelations: {
      type: String,
      enum: Object.values(RELATIONS), // กำหนดเป็นค่าที่เลือกจาก radio button
      required: true,
    },
    otherRelations: {
      type: String,
      required: function () {
        return this.relations === RELATIONS.OTHER; // ต้องกรอกข้อมูลเมื่อเลือก 'อื่นๆ'
      },
    },
  },
  { timestamps: true } // กำหนดให้บันทึกวันที่สร้างและแก้ไขข้อมูล
);

export default mongoose.model("Patient", PatientSchema);
