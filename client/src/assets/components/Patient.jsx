import {
  FaLocationArrow,
  FaBriefcase,
  FaCalendarAlt,
  FaRegEdit,
} from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Link, Form } from "react-router-dom";
import Wrapper from "../wrappers/Patient";
import PatientInfo from "./PatientInfo";
import day from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
day.extend(advancedFormat);

const Patient = ({
  _id,
  idPatient,
  namePatient,
  lastnamePatient,
  userType,
  userStatus,
  createdAt,
}) => {
  // แสดงเฉพาะ 8 ตัวแรกของ idPatient และเปลี่ยนตัวอักษรที่เหลือเป็น "x"
  const formattedIdPatient = idPatient.slice(0, 8) + "x".repeat(6);

  const date = day(createdAt).format("MMM Do, YYYY");

  return (
    <tr>
      <td>{formattedIdPatient}</td>
      <td>
        {namePatient} {lastnamePatient}
      </td>
      <td className={`status status-${userStatus.replace(/\s/g, "-")}`}>
        {userStatus}
      </td>
      <td className="actions">
        <Link to={`../edit-patient/${_id}`} className="btn edit-btn">
          <FaRegEdit />
        </Link>
        <Form method="post" action={`../delete-patient/${_id}`}>
          <button
            onClick={(e) =>
              window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบผู้ป่วยนี้?")
                ? someHandler(e)
                : e.preventDefault()
            }
            type="submit"
            className="btn delete-btn"
          >
            <MdDelete />
          </button>
        </Form>
      </td>
    </tr>
  );
};

export default Patient;
