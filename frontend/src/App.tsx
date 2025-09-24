import { BrowserRouter, Routes, Route } from "react-router-dom";
import Classroom from "./pages/classroom";
import Student from "./pages/student";
import { AppHeader } from "./components/Header";
import { Layout } from "antd";

function App() {
  return (
    <BrowserRouter>
      <Layout style={{ minHeight: "100vh" }}>
        <AppHeader />
        <Layout.Content style={{ padding: 24 }}>
          <Routes>
            <Route path="/classroom" element={<Classroom />} />
            <Route path="/student" element={<Student />} />
          </Routes>
        </Layout.Content>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
