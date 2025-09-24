import { useState, useEffect } from "react";

import {
  Input,
  InputNumber,
  Button,
  List,
  Modal,
  Form,
  Typography,
  message,
  Divider,
  Spin,
  Popconfirm,
  Select,
} from "antd";
import { HomeOutlined, UserOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import axios from "axios";

const { Title } = Typography;
const { Search } = Input;

interface Prefix {
  prefixId: number;
  prefixName: string;
}

interface Student {
  studentId: number;
  prefix?: Prefix;
  firstName: string;
  lastName: string;
}

interface StudentClassroom {
  student_classroom_id: string;
  studentid: string;
  student: Student;
}

interface Classroom {
  classroomid: string;
  classname: string;
  academicyear: number;
  teacher: string;
  studentClassrooms?: StudentClassroom[];
}

export default function ClassroomPage() {
  const [classroomForm] = Form.useForm();
  const [studentForm] = Form.useForm();

  const [classroomList, setClassroomList] = useState<Classroom[]>([]);
  const [filteredList, setFilteredList] = useState<Classroom[]>([]);
  const [studentList, setStudentList] = useState<Student[]>([]);

  const [currentEditing, setCurrentEditing] = useState<Classroom | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showStudentSection, setShowStudentSection] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClassroomList();
    fetchStudentList();
  }, []);

  const fetchClassroomList = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/classroom");
      setClassroomList(res.data.data);
      setFilteredList(res.data.data);
    } catch {
      message.error("โหลดห้องเรียนล้มเหลว");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentList = async () => {
    try {
      const res = await axios.get("/api/student");
      setStudentList(res.data.data);
    } catch {
      message.error("โหลดรายชื่อนักเรียนล้มเหลว");
    }
  };

  const openModal = async (classroom?: Classroom) => {
    setIsModalOpen(true);
    setShowStudentSection(false);

    if (classroom) {
      try {
        setLoading(true);

        const res = await axios.get(`/api/classroom/${classroom.classroomid}`);
        setCurrentEditing(res.data.data);

        classroomForm.setFieldsValue({
          classname: res.data.data.classname,
          academicyear: res.data.data.academicyear,
          teacher: res.data.data.teacher,
        });
      } catch {
        message.error("cannot load classroom data");
        setIsModalOpen(false);
      } finally {
        setLoading(false);
      }
    } else {
      setCurrentEditing(null);
      classroomForm.resetFields();
    }
  };

  const saveClassroom = async () => {
    try {
      const values = await classroomForm.validateFields();
      if (currentEditing) {
        await axios.patch(`/api/classroom/${currentEditing.classroomid}`, values);
        message.success("Edit classroom successfully");
      } else {
        await axios.post("/api/classroom", values);
        message.success("Add classroom successfully");
      }
      setIsModalOpen(false);
      fetchClassroomList();
    } catch {
      message.error("บันทึกห้องเรียนล้มเหลว");
    }
  };

  const deleteClassroom = async (id: string) => {
    try {
      await axios.delete(`/api/classroom/${id}`);
      message.success("Delete classroom successfully");
      fetchClassroomList();
    } catch (error: any) {
      const errMsg = error.response?.data?.message || "Cannot delete classroom";
      message.error(errMsg);
    }
  };

  const addStudentToClassroom = async (values: any) => {
    if (!currentEditing) return;

    try {
      const res = await axios.post(`/api/classroom/${currentEditing.classroomid}/students/${values.studentId}`);

      message.success(res.data.message || "Add student to classroom successfully");

      const classFetch = await axios.get(`/api/classroom/${currentEditing.classroomid}`);
      setCurrentEditing(classFetch.data.data);

      studentForm.resetFields();
    } catch (error: any) {
      const errMsg = error.response?.data?.message || "Cannot add student to classroom";
      message.error(errMsg);
    }
  };

  const removeStudentFromClassroom = async (studentId: string) => {
    if (!currentEditing) return;
    try {
      await axios.delete(`/api/classroom/${currentEditing.classroomid}/students/${studentId}`);
      message.success("Delete student from classroom successfully");
      const res = await axios.get(`/api/classroom/${currentEditing.classroomid}`);
      setCurrentEditing(res.data.data);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Cannot remove student from classroom";
      message.error(errMsg);
    }
  };

  const searchClassroom = (query: string) => {
    const lower = query.toLowerCase();
    setFilteredList(
      classroomList.filter((c) =>
        [c.classroomid, c.classname, c.academicyear, c.teacher]
          .map((f) => String(f).toLowerCase())
          .some((f) => f.includes(lower))
      )
    );
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <Title level={3} style={{ textAlign: "center" }}>
        ห้องเรียน
      </Title>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <Search
          placeholder="ค้นหาเลขห้อง ชื่อห้อง ชื่อครู หรือปีการศึกษา"
          allowClear
          enterButton={<SearchOutlined />}
          onChange={(e) => searchClassroom(e.target.value)}
          style={{ flex: 1 }}
        />
        <Button type="primary" onClick={() => openModal()}>
          เพิ่มห้องเรียน
        </Button>
      </div>

      <List
        loading={loading}
        bordered
        dataSource={filteredList}
        renderItem={(classroom) => (
          <List.Item
            actions={[
              <Button key="edit" type="link" icon={<EditOutlined />} onClick={() => openModal(classroom)} />,
              <Popconfirm key="delete" title="ลบห้องเรียน?" onConfirm={() => deleteClassroom(classroom.classroomid)}>
                <Button type="link" danger icon={<DeleteOutlined />} />
              </Popconfirm>,
            ]}
          >
            <div>
              <strong>เลขห้อง:</strong> {classroom.classroomid} <br />
              <strong>ชื่อห้อง:</strong> {classroom.classname} <br />
              <strong>ปีการศึกษา:</strong> {classroom.academicyear} <br />
              <strong>ครู:</strong> {classroom.teacher}
            </div>
          </List.Item>
        )}
      />

      <Modal
        open={isModalOpen}
        onOk={saveClassroom}
        onCancel={() => setIsModalOpen(false)}
        forceRender
        okText="บันทึก"
        cancelText="ยกเลิก"
        width={720}
        afterClose={() => {
          classroomForm.resetFields();
          studentForm.resetFields();
        }}
      >
        <Spin spinning={loading}>
          <Form form={classroomForm} layout="vertical">
            <Form.Item name="classname" label="ชื่อห้อง" rules={[{ required: true, message: "กรุณากรอกชื่อห้อง" }]}>
              <Input prefix={<HomeOutlined />} />
            </Form.Item>

            <Form.Item
              name="academicyear"
              label="ปีการศึกษา"
              rules={[{ required: true, message: "กรุณากรอกปีการศึกษา" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={2000}
                max={2100}
                onChange={(value) => {
                  if (value && value.toString().length > 4) {
                    classroomForm.setFieldsValue({ academicyear: Number(value.toString().slice(0, 4)) });
                  }
                }}
              />
            </Form.Item>

            <Form.Item name="teacher" label="ครูประจำชั้น" rules={[{ required: true, message: "กรุณากรอกชื่อครู" }]}>
              <Input prefix={<UserOutlined />} />
            </Form.Item>
          </Form>

          {currentEditing && (
            <>
              <Divider />
              <Title level={5}>จัดการนักเรียนในห้อง</Title>
              <Button type="default" onClick={() => setShowStudentSection((prev) => !prev)} style={{ marginBottom: 8 }}>
                {showStudentSection ? "ซ่อนนักเรียน" : "จัดการนักเรียน"}
              </Button>

              {showStudentSection && (
                <>
                  <List
                    size="small"
                    header={<strong>รายชื่อนักเรียน</strong>}
                    bordered
                    dataSource={currentEditing.studentClassrooms || []}
                    locale={{ emptyText: "ยังไม่มีนักเรียนในห้องนี้" }}
                    style={{ maxHeight: 200, overflow: "auto", marginBottom: 16 }}
                    renderItem={(sc) => (
                      <List.Item
                        actions={[
                          <Popconfirm
                            key="remove"
                            title="นำออกจากห้อง?"
                            onConfirm={() => removeStudentFromClassroom(sc.studentid)}
                          >
                            <Button type="link" danger icon={<DeleteOutlined />} />
                          </Popconfirm>,
                        ]}
                      >
                        {sc.student.prefix?.prefixName} {sc.student.firstName} {sc.student.lastName}
                      </List.Item>
                    )}
                  />

                  <Form form={studentForm} layout="inline" onFinish={addStudentToClassroom} style={{ gap: 8 }}>
                    <Form.Item name="studentId" rules={[{ required: true, message: "เลือกนักเรียน" }]}>
                      <Select
                        placeholder="เลือกนักเรียน"
                        style={{ minWidth: 200 }}
                        options={studentList
                          .filter(
                            (s) =>
                              !currentEditing.studentClassrooms?.map((sc) => sc.studentid).includes(String(s.studentId))
                          )
                          .map((s) => ({
                            value: String(s.studentId),
                            label: `${s.prefix?.prefixName} ${s.firstName} ${s.lastName}`,
                          }))}
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit">
                        เพิ่มนักเรียน
                      </Button>
                    </Form.Item>
                  </Form>
                </>
              )}
            </>
          )}
        </Spin>
      </Modal>
    </div>
  );
}
