import axios from "axios";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Offcanvas,
  Row,
  Table,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

const baseUrl = process.env.REACT_APP_BASE_URL;

const validationSchema = Yup.object({
  employeeId: Yup.string().required("EmployeeID is required"),
  employeeName: Yup.string().required("Employee Name is required"),
  position: Yup.string().required("Position is required"),
  department: Yup.string().required("Department is required"),
  salary: Yup.number().required("Salary is required"),
});

const Employee = () => {
  const navigate = useNavigate();
  const authToken = useSelector((x) => x.user.token);
  const [employeesData, setEmployeesData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [showCanvas, setShowCanvas] = useState(false);
  const [loading, setLoading] = useState(false);

  const allEmployees = async () => {
    setLoading(true);
    try {
      const query = {
        query: `
          query {getAllEmployees{success message data}}
        `,
      };
      const response = await axios.post(`${baseUrl}`, query, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = response.data.data.getAllEmployees;
      setEmployeesData(data.data);
    } catch (error) {
      console.error("Error while fetching all employees", error.message);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getEmployee = async (employeeId) => {
    setLoading(true);
    try {
      const query = {
        query: `
          query {getAllEmployees(employeeId: "${employeeId}"){success message data}}
        `,
      };
      const response = await axios.post(`${baseUrl}`, query, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = response.data.data.getAllEmployees;
      setEmployeesData(data.data);
    } catch (error) {
      console.error("Error while fetching employee", error.message);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const addEmployee = async (values, resetForm) => {
    setLoading(true);
    try {
      const mutation = {
        query: `
        mutation{createEmployee(input: {employeeId: "${values.employeeId}", employeeName: "${values.employeeName}", position: "${values.position}", department: "${values.department}", salary: ${values.salary}}){success message data}}`,
      };
      const response = await axios.post(`${baseUrl}`, mutation, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = response.data.data.createEmployee;
      alert(data.message);
      if (data.success === true) {
        setShowCanvas(false);
        resetForm();
        await allEmployees();
      }
    } catch (error) {
      console.error("Error while adding employee", error.message);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const allDepartments = async () => {
    try {
      const query = {
        query: `
        query{getEmployeeDepartments{success message data}}`,
      };
      const response = await axios.post(`${baseUrl}`, query, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = response.data.data.getEmployeeDepartments;

      if (data.success === true) {
        setDepartmentData(data.data);
      }
    } catch (error) {
      console.error("Error while fetching departments", error.message);
      alert("Something went wrong!");
    }
  };

  useEffect(() => {
    allEmployees();
    allDepartments();
  }, [authToken]);
  return (
    <div className="d-flex min-vh-100">
      <Container>
        <Row>
          <h4 className="m-4">Employees List</h4>
          <hr />
          <Col>
            <div className="d-flex justify-content-between w-100 mb-3">
              <Button variant="outline-secondary" onClick={() => navigate("/")}>
                Back to Home
              </Button>
              <Button
                variant="outline-success"
                onClick={() => setShowCanvas(true)}
              >
                Add Employee
              </Button>
            </div>
            {loading ? (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "200px" }}
              >
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : employeesData.length > 0 ? (
              <Table className="mt-3" bordered>
                <thead>
                  <tr>
                    <th>Name of the Employee0</th>
                    <th>Position</th>
                  </tr>
                </thead>
                <tbody>
                  {employeesData.map((emp, idx) => (
                    <tr
                      key={idx}
                      onClick={() => getEmployee(emp._id)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>{emp.employeeName}</td>
                      <td>{emp.position}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "60vh", fontSize: "1.5rem", color: "#555" }}
              >
                No Employees found!
              </div>
            )}
          </Col>
        </Row>

        <Offcanvas
          show={showCanvas}
          onHide={() => setShowCanvas(false)}
          placement="end"
        >
          <Offcanvas.Header>
            <h5>Add Employee</h5>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Formik
              initialValues={{
                employeeId: "",
                employeeName: "",
                position: "",
                department: "",
                salary: "",
              }}
              validationSchema={validationSchema}
              onSubmit={(values, { resetForm }) => {
                addEmployee(values, resetForm);
              }}
            >
              {({
                handleSubmit,
                handleChange,
                handleBlur,
                errors,
                values,
                touched,
              }) => (
                <Form onSubmit={handleSubmit}>
                  <Form.Group>
                    <Form.Label>Employee ID</Form.Label>
                    <Form.Control
                      type="text"
                      name="employeeId"
                      value={values.employeeId}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={errors.employeeId && touched.employeeId}
                    />
                    {errors.employeeId && touched.employeeId && (
                      <p className="text-danger">{errors.employeeId}</p>
                    )}
                  </Form.Group>

                  <Form.Group className="mt-2">
                    <Form.Label>Employee Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="employeeName"
                      value={values.employeeName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={errors.employeeName && touched.employeeName}
                    />
                    {errors.employeeName && touched.employeeName && (
                      <p className="text-danger">{errors.employeeName}</p>
                    )}
                  </Form.Group>

                  <Form.Group className="mt-2">
                    <Form.Label>Position</Form.Label>
                    <Form.Control
                      type="text"
                      name="position"
                      value={values.position}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={errors.position && touched.position}
                    />
                    {errors.position && touched.position && (
                      <p className="text-danger">{errors.position}</p>
                    )}
                  </Form.Group>

                  <Form.Group className="mt-2">
                    <Form.Label>Department</Form.Label>
                    <Form.Select
                      type="text"
                      name="department"
                      value={values.department}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={errors.department && touched.department}
                    >
                      <option value="">Select Department</option>
                      {departmentData.map((dept) => (
                        <option key={dept._id} value={dept._id}>
                          {dept.departmentName}
                        </option>
                      ))}
                    </Form.Select>
                    {errors.department && touched.department && (
                      <p className="text-danger">{errors.department}</p>
                    )}
                  </Form.Group>

                  <Form.Group className="mt-2">
                    <Form.Label>Salary</Form.Label>
                    <Form.Control
                      type="number"
                      name="salary"
                      value={values.salary}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={errors.salary && touched.salary}
                    />
                    {errors.salary && touched.salary && (
                      <p className="text-danger">{errors.salary}</p>
                    )}
                  </Form.Group>

                  <Button type="submit" className="mt-4 w-100">
                    Submit
                  </Button>
                </Form>
              )}
            </Formik>
          </Offcanvas.Body>
        </Offcanvas>
      </Container>
    </div>
  );
};

export default Employee;
