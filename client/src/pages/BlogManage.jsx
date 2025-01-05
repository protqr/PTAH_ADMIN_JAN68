// import React, { useContext, createContext, useEffect } from "react";
// import { toast } from "react-toastify";
// import customFetch from "../utils/customFetch.js";
// import PostContainer from "../assets/components/PostContainer.jsx";
// import AddButton from "../assets/components/AddButton.jsx";
// import AllHeader from "../assets/components/AllHeader.jsx";
// import { useLoaderData, useNavigate } from "react-router-dom";
// import { MdOutlineAutoDelete } from "react-icons/md";

// // Loader function for fetching posts
// export const loader = async ({ request }) => {
//   const params = Object.fromEntries([
//     ...new URL(request.url).searchParams.entries(),
//   ]);

//   try {
//     const { data } = await customFetch.get("/posts", {
//       params,
//     });
//     return {
//       data,
//     };
//   } catch (error) {
//     toast.error(error?.response?.data?.msg);
//     return error;
//   }
// };

// const AllPostContext = createContext();

// const BlogManage = () => {
//   const { data } = useLoaderData();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (data && data.posts) {
//       console.log(data.posts);
//     } else {
//       console.log("No post to display");
//     }
//   }, [data]);

//   return (
//     <AllPostContext.Provider value={{ data }}>
//       <PostContainer />
//     </AllPostContext.Provider>
//   );
// };

// export const useAllPostContext = () => useContext(AllPostContext);

// export default BlogManage;

import React, { useState } from "react";
import {
  FaUserCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaTrash,
} from "react-icons/fa"; // นำเข้าไอคอน

const BlogManage = () => {
  const [activeTab, setActiveTab] = useState("pending");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="max-w-4xl mx-auto my-8">
      <div className="flex justify-center items-center space-x-8 mb-6 border-b-1">
        {/* <button
          onClick={() => handleTabClick("pending")}
          className={`pb-2 font-bold ${
            activeTab === "pending"
              ? "border-b-2 border-[#d30000] text-[#d30000]"
              : "text-gray-500"
          }`}
        >
          ยังไม่อนุมัติ
        </button> */}
        {/* <div className="h-12 w-0.5 bg-gray-500 mb-2"></div> */}
        <button
          onClick={() => handleTabClick("approved")}
          className={`pb-2 font-bold ${
            activeTab === "approved"
              ? "border-b-2 border-[#7b7b7b] text-[#7b7b7b]"
              : "text-gray-500"
          }`}
        >
          กระทู้ทั้งหมด
        </button>
      </div>

      {activeTab === "pending" && (
        <div>
          {/* Card 1 */}
          <div className="border p-6 rounded-lg shadow-lg bg-white mb-6">
            <div className="flex justify-between items-center mb-4">
              <div className="text-lg font-semibold">
                ถ้าผู้ป่วยไม่ยอมทานอาหารเลย ควรทำยังไงดีคะ
              </div>
              <div className="text-sm text-gray-400">
                20 ตุลาคม 2567 เวลา 18:13 น.
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              สวัสดีค่ะ คือช่วงนี้คุณยายเราทานอาหารยากมากๆ เลยค่ะ
              เลยอยากจะสอบถามว่ามีวิธีไหนที่จะทำให้ท่านทานอาหารบ้างคะ ขอบคุณค่ะ
            </p>
            <div className="text-sm text-gray-500 mb-2 flex items-center">
              <FaUserCircle className="h-6 w-6 text-gray-500 mr-2" />{" "}
              <span className="font-semibold">โดย นxxxx รxxxx</span>
            </div>
            <div className="flex justify-end space-x-4">
              <button className="flex items-center text-red-500 font-semibold hover:text-red-700">
                <FaTrash className="mr-1 h-4 w-4" /> ลบกระทู้
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="border p-6 rounded-lg shadow-lg bg-white mb-6">
            <div className="flex justify-between items-center mb-4">
              <div className="text-lg font-semibold">
                มีอาการคลื่นไส้ ไม่อยากกินอาหารมา 3 วันแล้ว
              </div>
              <div className="text-sm text-gray-400">
                19 ตุลาคม 2567 เวลา 19:57 น.
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              อยากอาเจียนกับไม่อยากกินอาหารมา3วันแล้วค่ะ เกิดจากอะไรเหรอคะ
            </p>
            <div className="text-sm text-gray-500 mb-2 flex items-center">
              <FaUserCircle className="h-6 w-6 text-gray-500 mr-2" />{" "}
              <span className="font-semibold">โดย จxxxx ชxxxx</span>
            </div>
            <div className="flex justify-end space-x-4">
              <button className="flex items-center text-red-500 font-semibold hover:text-red-700">
                <FaTrash className="mr-1 h-4 w-4" /> ลบกระทู้
              </button>
            </div>
          </div>

          <div className="border p-6 rounded-lg shadow-lg bg-white mb-6">
            <div className="flex justify-between items-center mb-4">
              <div className="text-lg font-semibold">กลืนน้ำลายแล้วเจ็บคอ</div>
              <div className="text-sm text-gray-400">
                15 ตุลาคม 2567 เวลา 15:23 น.
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              อยากอาเจียนกับไม่อยากกินอาหารมา3วันแล้วค่ะ เกิดจากอะไรเหรอคะ
            </p>
            <div className="text-sm text-gray-500 mb-2 flex items-center">
              <FaUserCircle className="h-6 w-6 text-gray-500 mr-2" />{" "}
              <span className="font-semibold">โดย สxxxx อxxxx</span>
            </div>
            <div className="flex justify-end space-x-4">
              <button className="flex items-center text-red-500 font-semibold hover:text-red-700">
                <FaTrash className="mr-1 h-4 w-4" /> ลบกระทู้
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "approved" && (
        <div>
          <div className="border p-6 rounded-lg shadow-lg bg-white mb-6">
            <div className="flex justify-between items-center mb-4">
              <div className="text-lg font-semibold">กลืนน้ำลายแล้วเจ็บคอ</div>
              <div className="text-sm text-gray-400">
                15 ตุลาคม 2567 เวลา 15:23 น.
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              อยากอาเจียนกับไม่อยากกินอาหารมา3วันแล้วค่ะ เกิดจากอะไรเหรอคะ
            </p>
            <div className="text-sm text-gray-500 mb-2 flex items-center">
              <FaUserCircle className="h-6 w-6 text-gray-500 mr-2" />{" "}
              <span className="font-semibold">โดย สxxxx อxxxx</span>
            </div>
            <div className="flex justify-end space-x-4">
              <button className="flex items-center text-red-500 font-semibold hover:text-red-700">
                <FaTrash className="mr-1 h-4 w-4" /> ลบกระทู้
              </button>
            </div>
          </div>

          <div>
            <div className="border p-6 rounded-lg shadow-lg bg-white mb-6">
              <div className="flex justify-between items-center mb-4">
                <div className="text-lg font-semibold">
                  กลืนน้ำลายแล้วเจ็บคอ
                </div>
                <div className="text-sm text-gray-400">
                  14 ตุลาคม 2567 เวลา 13:02 น.
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                มีอาการกลืนลำบากค่ะ เนื่องจากเวลากลืนอาหาร หรือน้ำลายจะเจ็บคอ
                เป็นมา2วันแล้วค่ะ สาเหตุเกิดจากอะไรเหรอคะ
              </p>
              <div className="text-sm text-gray-500 mb-2 flex items-center">
                <FaUserCircle className="h-6 w-6 text-gray-500 mr-2" />{" "}
                <span className="font-semibold">โดย สxxxx nxxxx</span>
              </div>
              <div className="flex justify-end space-x-4">
                <button className="flex items-center text-red-500 font-semibold hover:text-red-700">
                  <FaTrash className="mr-1 h-4 w-4" /> ลบกระทู้
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManage;
