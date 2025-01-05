import Patient from "../models/PatientModel.js";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import day from "dayjs";

export const getAllPatients = async (req, res) => {
  const { search, userStatus, userType, sort, isDeleted } = req.query;
  console.log(isDeleted);

  const queryObject = {};
  if (typeof isDeleted !== "undefined") {
    queryObject.isDeleted = isDeleted === "true";
  } else {
    queryObject.isDeleted = { $nin: [true] };
  }
  if (search) {
    queryObject.$or = [
      { idPatient: { $regex: search, $options: "i" } },
      { namePatient: { $regex: search, $options: "i" } },
      { lastnamePatient: { $regex: search, $options: "i" } },
    ];
  }

  if (userStatus && userStatus !== "ทั้งหมด") {
    queryObject.userStatus = userStatus;
  }

  if (userType && userType !== "all") {
    queryObject.userType = userType;
  }

const sortOptions = {
  ใหม่ที่สุด: "-createdAt",
  เก่าที่สุด: "createdAt",
  "เรียงจาก ก-ฮ": "-name",
  "เรียงจาก ฮ-ก": "name",
};


  const sortKey = sortOptions[sort] || sortOptions.ใหม่ที่สุด;

  // แบ่งหน้า

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const allusers = await Patient.find(queryObject)
    .sort(sortKey)
    .skip(skip)
    .limit(limit); // ลบ { createdBy: req.user.userId } เพื่อค้นหาข้อมูลทั้งหมด
  const totalPatients = await Patient.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalPatients / limit);
  res
    .status(StatusCodes.OK)
    .json({ totalPatients, numOfPages, currentPage: page, allusers });
};

export const createPatient = async (req, res) => {
  // Extract idPatient from request body
  const { _id } = req.body;

  // Check if idPatient already exists in the database
  const existingPatient = await Patient.findOne({ _id });
  if (existingPatient) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "idPatient already exists" });
  }

  // If idPatient does not exist, proceed to create new patient
  req.body.createdBy = req.user.userId;
  const patientuser = await Patient.create(req.body);
  res.status(StatusCodes.CREATED).json({ patientuser });
};

export const getPatient = async (req, res) => {
  const patient = await Patient.findById(req.params._id);
  if (!patient) throw new NotFoundError(`no patient with id : ${idPatient}`);
  res.status(StatusCodes.OK).json({ patient });
};

export const updatePatient = async (req, res) => {
  const updatedPatients = await Patient.findByIdAndUpdate(
    req.params._id,
    req.body,
    {
      new: true,
    }
  );

  if (!updatedPatients)
    throw new NotFoundError(`no patient with id : ${req.params._id}`);

  res.status(StatusCodes.OK).json({ patient: updatedPatients });
};

// export const deletePatient = async (req, res) => {
//   const removedPatient = await Patient.findByIdAndDelete(req.params._id);

//   if (!removedPatient)
//     throw new NotFoundError(`no patient with id : ${idPatient}`);
//   res.status(StatusCodes.OK).json({ patient: removedPatient });
// };

export const deletePatient = async (req, res) => {
  const { _id } = req.params;

  try {
    const updatedPatients = await Patient.findByIdAndUpdate(
      _id,
      { isDeleted: true },
      { new: true }
    );

    if (!updatedPatients) {
      throw new NotFoundError(`no Patient with id : ${_id}`);
    }

    res.status(StatusCodes.OK).json({ Patient: updatedPatients });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

export const showStats = async (req, res) => {
  let stats = await Patient.aggregate([
    { $group: { _id: "$userStatus", count: { $sum: 1 } } },
  ]);

  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});

  const totalPatients = await Patient.countDocuments(); // นับจำนวนผู้ป่วยทั้งหมด

  const defaultStats = {
    กำลังรักษา: stats.กำลังรักษาอยู่ || 0,
    จบการรักษา: stats.จบการรักษา || 0,
    ผู้ป่วยทั้งหมด: totalPatients || 0,
  };

  let monthlyApplications = await Patient.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    { $limit: 6 },
  ]);

  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;

      const date = day()
        .month(month - 1)
        .year(year)
        .format("MMM YYYY");

      return { date, count };
    })
    .reverse();

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};
