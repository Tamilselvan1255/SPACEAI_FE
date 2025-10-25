import React, { useState } from "react";
import { Button, Card, Col, Form, InputGroup, Row } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToken } from "../redux/userSlice";

const validationSchema = Yup.object({
  email: Yup.string().required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const baseUrl = process.env.REACT_APP_BASE_URL;

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [passwordEye, setPasswordEye] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const query = {
        query: `
          mutation{
            userLogin(input:{email: "${values.email}", password: "${values.password}"})
            {success message token}
          }
        `,
      };
      const response = await axios.post(`${baseUrl}`, query);
      const data = response.data.data.userLogin;

      alert(data.message);
      if (data.success === true) {
        dispatch(addToken(data.token));
        navigate("/employee");
      }
    } catch (error) {
      console.error("Error while login", error.message);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <Row>
        <Col>
          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{height: "200px"}}>
              <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <Card>
              <Card.Body>
                <Formik
                  initialValues={{
                    email: "",
                    password: "",
                  }}
                  validationSchema={validationSchema}
                  onSubmit={(values, { resetForm }) => {
                    handleLogin(values, resetForm);
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
                      <h5>Login</h5>
                      <hr />
                      <Form.Group>
                        <Form.Label className="d-flex justify-content-start">
                          Email
                        </Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          onChange={handleChange}
                          value={values.email}
                          onBlur={handleBlur}
                          isInvalid={errors.email && touched.email}
                        />
                        {errors.email && touched.email && (
                          <p className="text-danger d-flex justify-content-start">
                            {errors.email}
                          </p>
                        )}
                      </Form.Group>

                      <Form.Group>
                        <Form.Label className="d-flex justify-content-start">
                          Password
                        </Form.Label>
                        <InputGroup>
                          <Form.Control
                            type={passwordEye ? "text" : "password"}
                            name="password"
                            onChange={handleChange}
                            value={values.password}
                            onBlur={handleBlur}
                            isInvalid={errors.password && touched.password}
                          />
                          <InputGroupText
                            onClick={() => setPasswordEye((prev) => !prev)}
                          >
                            {passwordEye ? <IoMdEye /> : <IoMdEyeOff />}
                          </InputGroupText>
                        </InputGroup>
                        {errors.password && touched.password && (
                          <p className="text-danger d-flex justify-content-start">
                            {errors.password}
                          </p>
                        )}
                      </Form.Group>

                      <Button type="submit" className="mt-4 w-100">
                        Login
                      </Button>
                    </Form>
                  )}
                </Formik>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Home;
