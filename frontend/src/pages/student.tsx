import { useState, useEffect } from "react";
import {
  Input,
  Button,
  List,
  Modal,
  Form,
  Typography,
  message,
  Spin,
  Popconfirm,
  Divider,
  Select,
  DatePicker,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

type Prefix = { prefixId: number; prefixName: string };
type Gender = { genderid: number; gendername: string };
type GradeLevel = { gradelevelid: number; levelname: string };

type Student = {
  studentId: number;
  firstName: string;
  lastName: string;
  prefix?: Prefix;
  genderid?: number;
  gender?: Gender;
  birthDate?: string;
  gradelevelid?: number;
  gradelevel?: GradeLevel;
};

export default function StudentPage() {
  const [form] = Form.useForm();
  const [students, setStudents] = useState<Student[]>([]);
  const [filtered, setFiltered] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [gender, setGender] = useState<Gender[]>([]);
  const [prefixes, setPrefixes] = useState<Prefix[]>([]);
  const [gradeLevels, setGradeLevels] = useState<GradeLevel[]>([]);

  useEffect(() => {
    loadStudents();
    loadFormData();
  }, []);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/student");
      setStudents(res.data.data);
      setFiltered(res.data.data);
    } catch {
      message.error("Cannot fetch students");
    } finally {
      setLoading(false);
    }
  };

  const loadFormData = async () => {
    try {
      const res = await axios.get("/api/student/form-data");
      setPrefixes(res.data.data.prefixes);
      setGender(res.data.data.gender);
      setGradeLevels(res.data.data.gradeLevels);
    } catch {
      message.error("Cannot fetch form data");
    }
  };

  const searchStudent = (text: string) => {
    const lower = text.toLowerCase();
    setFiltered(
      students.filter((s: Student) => {
        const studentIdStr = s.studentId?.toString() || "";
        const gradeStr = s.gradelevel?.levelname || "";
        const prefixStr = s.prefix?.prefixName || "";
        const nameStr = `${s.firstName} ${s.lastName}`;
        const genderStr = s.gender?.gendername || "";

        return (
          studentIdStr.toLowerCase().includes(lower) ||
          gradeStr.toLowerCase().includes(lower) ||
          prefixStr.toLowerCase().includes(lower) ||
          nameStr.toLowerCase().includes(lower) ||
          genderStr.toLowerCase().includes(lower)
        );
      })
    );
  };

  const openModal = (student?: Student) => {
    setModalOpen(true);
    if (student) {
      setEditingStudent(student);
      form.setFieldsValue({
        prefixId: student.prefix?.prefixId,
        firstName: student.firstName,
        lastName: student.lastName,
        genderid: student.genderid,
        birthDate: student.birthDate ? dayjs(student.birthDate) : null,
        gradelevelid: student.gradelevel?.gradelevelid,
      });
    } else {
      setEditingStudent(null);
      form.resetFields();
    }
  };

  const saveStudent = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        birthDate: (values.birthDate as Dayjs).format("YYYY-MM-DD"),
      };
      if (editingStudent) {
        await axios.patch(`/api/student/${editingStudent.studentId}`, payload);
        message.success("Edit student successfully");
      } else {
        await axios.post("/api/student", payload);
        message.success("Add student successfully");
      }
      setModalOpen(false);
      loadStudents();
    } catch (err) {
      console.log(err);
      message.error("Cannot save student");
    }
  };

  const deleteStudent = async (id: number) => {
    try {
      await axios.delete(`/api/student/${id}`);
      message.success("Remove student successfully");
      loadStudents();
    } catch {
      message.error("Cannot remove student");
    }
  };

  // ----- Group by grade -----
  const groupedByGrade: Record<string, Student[]> = {};
  const sortedStudents = [...filtered].sort(
    (a, b) => (a.gradelevelid || 0) - (b.gradelevelid || 0) || a.studentId - b.studentId
  );
  sortedStudents.forEach((s) => {
    const grade = s.gradelevel?.levelname || "ไม่ระบุ";
    if (!groupedByGrade[grade]) groupedByGrade[grade] = [];
    groupedByGrade[grade].push(s);
  });

  // ----- Render -----
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <Title level={3} style={{ textAlign: "center" }}>
        นักเรียน
      </Title>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <Search
          placeholder="ค้นหาชื่อ, เลขประจำตัว, ชั้นเรียน, คำนำหน้า หรือ เพศ"
          allowClear
          enterButton={<SearchOutlined />}
          onChange={(e) => searchStudent(e.target.value)}
          style={{ flex: 1 }}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
          เพิ่มนักเรียน
        </Button>
      </div>

      <Spin spinning={loading}>
        {Object.keys(groupedByGrade).map((grade) => (
          <div key={grade} style={{ marginBottom: 24 }}>
            <Divider orientation="left">{grade}</Divider>
            <List
              bordered
              dataSource={groupedByGrade[grade]}
              renderItem={(student: Student) => (
                <List.Item
                  actions={[
                    <Button type="link" icon={<EditOutlined />} onClick={() => openModal(student)} />,
                    <Popconfirm title="ลบนักเรียน?" onConfirm={() => deleteStudent(student.studentId)}>
                      <Button type="link" danger icon={<DeleteOutlined />} />
                    </Popconfirm>,
                  ]}
                >
                  <div>
                    เลขประจำตัว: {student.studentId} {student.prefix?.prefixName} {student.firstName} {student.lastName}
                    <br />
                    เพศ: {student.gender?.gendername || "-"}
                  </div>
                </List.Item>
              )}
            />
          </div>
        ))}
      </Spin>

      {/* Modal */}
      <Modal
        open={modalOpen}
        onOk={saveStudent}
        onCancel={() => setModalOpen(false)}
        okText="บันทึก"
        cancelText="ยกเลิก"
        forceRender
        afterClose={() => form.resetFields()}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="prefixId" label="คำนำหน้า" rules={[{ required: true, message: "กรุณาเลือกคำนำหน้า" }]}>
            <Select<number> placeholder="เลือกคำนำหน้า">
              {prefixes.map((p) => (
                <Option key={p.prefixId} value={p.prefixId}>
                  {p.prefixName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="firstName"
            label="ชื่อ"
            rules={[
              { required: true, message: "กรุณากรอกชื่อ" },
              { max: 50, message: "ชื่อต้องไม่เกิน 50 ตัวอักษร" },
              {
                pattern: /^[ก-๙a-zA-Z\s]+$/,
                message: "ชื่อสามารถกรอกได้เฉพาะตัวอักษรไทย อังกฤษ หรือเว้นวรรคเท่านั้น",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="lastName"
            label="นามสกุล"
            rules={[
              { required: true, message: "กรุณากรอกนามสกุล" },
              { max: 50, message: "นามสกุลต้องไม่เกิน 50 ตัวอักษร" },
              {
                pattern: /^[ก-๙a-zA-Z\s]+$/,
                message: "นามสกุลสามารถกรอกได้เฉพาะตัวอักษรไทย อังกฤษ หรือเว้นวรรคเท่านั้น",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="birthDate" label="วันเกิด" rules={[{ required: true, message: "กรุณาเลือกวันเกิด" }]}>
            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item name="genderid" label="เพศ" rules={[{ required: true, message: "กรุณาเลือกเพศ" }]}>
            <Select<number> placeholder="เลือกเพศ">
              {gender.map((gen) => (
                <Option key={gen.genderid} value={gen.genderid}>
                  {gen.gendername}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="gradelevelid" label="ชั้นเรียน" rules={[{ required: true, message: "กรุณาเลือกชั้นเรียน" }]}>
            <Select<number> placeholder="เลือกชั้นเรียน">
              {gradeLevels.map((g) => (
                <Option key={g.gradelevelid} value={g.gradelevelid}>
                  {g.levelname}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
