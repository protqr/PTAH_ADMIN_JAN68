import React, { useState, useEffect } from "react";
import {
  FormRow,
  FormRowSelect,
  FormRowMultiSelect,
  FormRowRadio,
} from "../assets/components";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import {
  CHOOSEPOSTURES,
  TYPEPOSTURES,
  TYPESTATUS,
  GENDER,
  RELATIONS,
  HAVECAREGIVER,
} from "../../../utils/constants";
import {
  Form,
  redirect,
  useNavigation,
  useOutletContext,
} from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";

const isIdPatientDuplicate = async (idPatient) => {
  try {
    const response = await customFetch.get(`/allusers?idPatient=${idPatient}`);
    return response.data.length > 0;
  } catch (error) {
    console.error("Error checking duplicate idPatient:", error);
    return false;
  }
};

const isIdCardDuplicate = async (idNumber) => {
  try {
    const response = await customFetch.get(`/allusers?idNumber=${idNumber}`);
    return response.data.length > 0;
  } catch (error) {
    console.error("Error checking duplicate idNumber:", error);
    return false;
  }
};

export const action = async ({ request }) => {
  try {
    const formData = new FormData();
    const data = await request.formData();
    const idPatient = data.get("idPatient");
    const idNumber = data.get("idNumber");
    const namePatient = data.get("namePatient");
    const lastnamePatient = data.get("lastnamePatient");
    const sickness = data.get("sickness");
    const userGender = data.get("userGender");
    const userType = data.get("userType");
    const userPostsData = data.get("userPostsDummy");
    const userStatus = data.get("userStatus");
    const nameCaregiver = data.get("nameCaregiver");
    const lastnameCaregiver = data.get("lastnameCaregiver");
    const telCaregiver = data.get("telCaregiver");
    const caregiverRelations = data.get("caregiverRelations");
    const otherRelations = data.get("otherRelations");
    const youhaveCaregiver = data.get("youhaveCaregiver");

    const isDuplicate = await isIdPatientDuplicate(idPatient);
    if (isDuplicate) {
      toast.error("หมายเลขผู้ป่วยซ้ำกัน โปรดเลือกหมายเลขอื่น");
      return null;
    }

    if (!/^[0-9]+$/.test(idPatient)) {
      toast.error("หมายเลขผู้ป่วยต้องเป็นตัวเลขเท่านั้น");
      return null;
    }

    const isDuplicate2 = await isIdCardDuplicate(idNumber);
    if (isDuplicate2) {
      toast.error("หมายเลขบัตรประชาชนซ้ำกัน โปรดเลือกหมายเลขอื่น");
      return null;
    }

    if (!/^[0-9]+$/.test(idNumber)) {
      toast.error("หมายเลขบัตรประชาชนต้องเป็นตัวเลขเท่านั้น");
      return null;
    }

    if (youhaveCaregiver === HAVECAREGIVER.TYPE_CGV1) {
      if (
        !nameCaregiver ||
        !lastnameCaregiver ||
        !telCaregiver ||
        !caregiverRelations
      ) {
        toast.error("กรุณากรอกข้อมูลผู้ดูแลให้ครบถ้วน");
        return null;
      }
    }

    for (const [key, value] of data.entries()) {
      formData.append(key, value);
    }

    const patientData = {
      idPatient: idPatient,
      idNumber: idNumber,
      namePatient: namePatient,
      lastnamePatient: lastnamePatient,
      sickness: sickness,
      userGender: userGender,
      userType: userType,
      userPosts: userPostsData,
      userStatus: userStatus,
      youhaveCaregiver: youhaveCaregiver,
      nameCaregiver: nameCaregiver,
      lastnameCaregiver: lastnameCaregiver,
      telCaregiver: telCaregiver,
      caregiverRelations: caregiverRelations,
      otherRelations:
        caregiverRelations === RELATIONS.OTHER ? otherRelations : "",
    };

    console.log("Sending request:", patientData);
    await customFetch.post("/allusers", patientData);
    toast.success("เพิ่มข้อมูลคนไข้เรียบร้อยแล้ว");
    return redirect("/dashboard/all-patient");
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const AddUser = () => {
  const { user } = useOutletContext();
  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

  const handleUserPostsChange = (selectedOptions) => {
    setSelectedUserPosts(selectedOptions);
  };

  const [selectedUserGender, setSelectedUserGender] = useState(GENDER.GENDER_01);
  const [selectedUserType, setSelectedUserType] = useState(TYPEPOSTURES.TYPE_1);
  const [selectedUserPosts, setSelectedUserPosts] = useState([]);
  const [selectedUserStatus, setSelectedUserStatus] = useState(TYPESTATUS.TYPE_ST1);
  const [postures, setPostures] = useState([]);

  useEffect(() => {
    const fetchPostures = async () => {
      try {
        const { data } = await customFetch.get("/postures");
        setPostures(data.postures);
      } catch (error) {
        toast.error(error?.response?.data?.msg);
      }
    };
    fetchPostures();
  }, []);

  useEffect(() => {
    console.log(selectedUserPosts);
  }, [selectedUserPosts]);

  const handleUserTypeChange = (event) => {
    setSelectedUserGender(event.target.value);
    setSelectedUserType(event.target.value);
    setSelectedUserStatus(event.target.value);
    setSelectedYouhaveCaregiver(event.target.value);
  };

  const [selectedYouhaveCaregiver, setSelectedYouhaveCaregiver] = useState(HAVECAREGIVER.TYPE_CGV1);
  const [selectedRelation, setSelectedRelation] = useState("");
  const [otherRelation, setOtherRelation] = useState("");

  const handleRelationChange = (e) => {
    setSelectedRelation(e.target.value);
  };

  const handleOtherRelationChange = (e) => {
    setOtherRelation(e.target.value);
  };

  return (
    <Wrapper>
      <Form method="post" className="form">
        <h4 className="form-title">เพิ่มข้อมูลคนไข้</h4>
        <div className="form-center">
          <FormRow
            type="text"
            name="idNumber"
            labelText="หมายเลขบัตรประชาชน"
            pattern="[0-9]*"
          />
          <div className="row">
            <div className="column1">
              <FormRow
                type="text"
                name="idPatient"
                labelText="หมายเลขผู้ป่วย"
                pattern="[0-9]*"
              />
              <FormRow type="text" name="namePatient" labelText="ชื่อผู้ป่วย" />
              <FormRow
                type="text"
                name="lastnamePatient"
                labelText="นามสกุลผู้ป่วย"
              />
            </div>
            <div className="column2">
              <FormRow
                type="text"
                name="sickness"
                labelText="โรคหรืออาการของผู้ป่วย"
              />
              <FormRowSelect
                labelText="เลือกสถานะปัจจุบันของคนไข้"
                name="userStatus"
                value={selectedUserStatus}
                onChange={handleUserTypeChange}
                list={Object.values(TYPESTATUS)}
              />
              <FormRowSelect
                labelText="เพศ"
                name="userGender"
                value={selectedUserGender}
                onChange={handleUserTypeChange}
                list={Object.values(GENDER)}
              />
            </div>
          </div>
          <FormRowMultiSelect
            type="textarea"
            name="userPosts"
            labelText="เลือกท่ากายภาพบำบัด"
            options={["ท่าทั้งหมด", ...postures.map((p) => p.namePostures)]}
            value={selectedUserPosts}
            onChange={handleUserPostsChange}
          />
          <input name="userPostsDummy" value={selectedUserPosts} hidden></input>
        </div>
        <br />
        <br />
        <br />
        <hr />
        <br />
        <br />

        {/* เพิ่มข้อมูลผู้ดูแล */}
        <br />
        <h4 className="form-title">เพิ่มข้อมูลผู้ดูแล</h4>
        <div className="form-center">
          <FormRowSelect
            labelText="มีผู้ดูแลหรือไม่?"
            name="youhaveCaregiver"
            value={selectedYouhaveCaregiver}
            onChange={handleUserTypeChange}
            list={Object.values(HAVECAREGIVER)}
          />
          <div className="row">
            <div className="column1">
              {selectedYouhaveCaregiver === HAVECAREGIVER.TYPE_CGV1 && (
                <>
                  <FormRow
                    type="text"
                    name="nameCaregiver"
                    labelText="ชื่อจริง (ผู้ดูแล)"
                    required
                  />
                  <FormRow
                    type="text"
                    name="lastnameCaregiver"
                    labelText="นามสกุล (ผู้ดูแล)"
                    required
                  />
                  <FormRow
                    type="tel"
                    name="telCaregiver"
                    labelText="เบอร์โทรศัพท์ผู้ดูแล"
                    required
                  />
                </>
              )}
            </div>

            <div className="column2">
              {selectedYouhaveCaregiver === HAVECAREGIVER.TYPE_CGV1 && (
                <>
                  <FormRowRadio
                    name="caregiverRelations"
                    list={Object.values(RELATIONS)}
                    value={selectedRelation}
                    onChange={handleRelationChange}
                    otherOption={RELATIONS.OTHER}
                    otherValue={otherRelation}
                    onOtherChange={handleOtherRelationChange}
                    required
                  />
                </>
              )}
            </div>
          </div>
        </div>

        <br />
        <button
          type="submit"
          className="btn btn-block form-btn "
          disabled={isSubmitting}
        >
          {isSubmitting ? "submitting..." : "submit"}
        </button>
      </Form>
    </Wrapper>
  );
};

export default AddUser;
