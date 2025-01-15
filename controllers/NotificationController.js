import { StatusCodes } from "http-status-codes";
import NotificationModel from "../models/NotificationModel.js";
import { BadRequestError, NotFoundError } from "../errors/customError.js";
import { NOTIFY_STATUS } from "../utils/constants.js";

export const getAllNotifications = async (req, res) => {
  const { search, sort, isDeleted } = req.query;

  const queryObject = {};
  if (typeof isDeleted !== "undefined") {
    queryObject.isDeleted = isDeleted === "true";
  } else {
    queryObject.isDeleted = { $nin: [true] };
  }
  if (search) {
    queryObject.$or = [{ title: { $regex: search, $options: "i" } }];
  }

  const sortOptions = {
    ใหม่ล่าสุด: "-notifyDate",
    เก่าที่สุด: "notifyDate",
    "เรียงหัวข้อจาก ก-ฮ": "title",
    "เรียงหัวข้อจาก ฮ-ก": "-title",
  };

  const sortKey = sortOptions[sort] ?? sortOptions.ใหม่ล่าสุด;
  console.log("🚀  sortKey:", sortKey, sort);

  const pageNo = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 1000;
  const skip = (pageNo - 1) * limit;

  const data = await NotificationModel.find(queryObject)
    .sort(sortKey)
    .skip(skip)
    .limit(limit);
  const total = await NotificationModel.countDocuments(queryObject);
  const totalPage = Math.ceil(total / limit);
  res.status(StatusCodes.OK).json({ total, totalPage, pageNo, data });
};

export const addNotification = async (req, res) => {
  try {
    const { title, description, notifyDate, targetGroup, file, notifyType } =
      req.body;

    if (!title || !description || !notifyDate || !targetGroup || !notifyType) {
      throw new BadRequestError("Missing required fields");
    }

    const notiItem = await NotificationModel.create({
      title,
      description,
      notifyDate,
      targetGroup,
      file,
      notifyType,
      createdBy: req.user.userId,
      status: NOTIFY_STATUS.PENDING,
    });

    res.status(StatusCodes.CREATED).json(notiItem);
  } catch (error) {
    throw error;
  }
};

export const updateNotification = async (req, res) => {
  try {
    const { _id } = req.params;
    const updateData = req.body;

    if (
      !updateData.title ||
      !updateData.description ||
      !updateData.notifyDate ||
      !updateData.targetGroup ||
      !updateData.notifyType
    ) {
      throw new BadRequestError("Missing required fields");
    }
    const notiItem = await NotificationModel.findByIdAndUpdate(
      _id,
      {
        title: updateData.title,
        description: updateData.description,
        notifyDate: updateData.notifyDate,
        targetGroup: updateData.targetGroup,
        file: updateData.file,
        notifyType: updateData.notifyType,
        createdBy: req.user.userId,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!notiItem) {
      throw new NotFoundError("Notification not found");
    }

    res.status(StatusCodes.OK).json(notiItem);
  } catch (error) {
    console.error("Error updating notification:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const patchNotification = async (req, res) => {
  try {
    const { _id } = req.params;
    const updateData = req.body;

    if (Object.keys(updateData).length === 0) {
      throw new BadRequestError("No fields provided for update");
    }

    const allowedFields = [
      "title",
      "description",
      "notifyDate",
      "targetGroup",
      "file",
      "notifyType",
      "isDeleted",
    ];
    const filteredData = {};

    // Filter out only allowed fields for updating
    for (const key of allowedFields) {
      if (key in updateData) {
        filteredData[key] = updateData[key];
      }
    }

    // Add the `updatedBy` field to track who updated it
    filteredData.updatedBy = req.user.userId;

    const notiItem = await NotificationModel.findByIdAndUpdate(
      _id,
      filteredData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!notiItem) {
      throw new NotFoundError("Notification not found");
    }

    res.status(StatusCodes.OK).json(notiItem);
  } catch (error) {
    console.error("Error updating notification:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { _id } = req.params;

    const notiItem = await NotificationModel.findByIdAndUpdate(
      _id,
      { isDeleted: true },
      { new: true }
    );

    if (!notiItem) {
      throw new NotFoundError("Notification not found");
    }

    res.status(StatusCodes.OK).json(notiItem);
  } catch (error) {
    throw error;
  }
};

export const findNotification = async (req, res) => {
  try {
    const { _id } = req.params;

    const notiItem = await NotificationModel.findById(_id);

    if (!notiItem) {
      throw new NotFoundError("Notification not found");
    }

    res.status(StatusCodes.OK).json(notiItem);
  } catch (error) {
    throw error;
  }
};
