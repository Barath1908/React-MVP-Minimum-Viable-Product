import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, message } from "antd";
import { Grid, Header, Icon } from "semantic-ui-react";
import { MenuItem, InputAdornment, IconButton, Box } from "@mui/material";
import usePatients from "../../modules/patients/hooks/usePatients";
import {
  StyledButton,
  StyledTextField,
  StyledCard,
  StyledAlert,
} from "../../components/common";
import styled from "styled-components";

const FormContainer = styled.div`
  padding: 16px;
  background: ${({ theme }) => theme.colors?.background || "#0f1117"};
  min-height: 100%;
`;

const SectionHeader = styled.h4`
  color: #4f8ef7;
  border-bottom: 1px solid ${({ theme }) => theme.colors?.border || "#2a2d3e"};
  padding-bottom: 8px;
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-size: 13px;
`;

export default function PatientForm({ isEdit = false }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const {
    currentPatient,
    loading,
    error,
    createPatient,
    updatePatient,
    fetchPatientById,
  } = usePatients();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      fetchPatientById(id);
    }
  }, [isEdit, id, fetchPatientById]);

  useEffect(() => {
    if (isEdit && currentPatient && String(currentPatient.id) === String(id)) {
      form.setFieldsValue({
        first_name: currentPatient.first_name || "",
        last_name: currentPatient.last_name || "",
        gender: currentPatient.gender || "",
        date_of_birth: currentPatient.date_of_birth || "",
        age: currentPatient.age || "",
        blood_group: currentPatient.blood_group || "",
        email: currentPatient.email || "",
        phone: currentPatient.phone || "",
        address: currentPatient.address || "",
        emergency_contact: currentPatient.emergency_contact || "",
        allergies: currentPatient.allergies || "",
        medical_history: currentPatient.medical_history || "",
      });
    }
  }, [isEdit, currentPatient, id, form]);

  const onFinish = async (values) => {
    try {
      if (isEdit) {
        updatePatient(
          id,
          values,
          () => {
            message.success("Patient profile updated successfully!");
            navigate("/patients");
          },
          (err) => {
            message.error(err || "Failed to update patient record.");
          }
        );
      } else {
        createPatient(
          values,
          () => {
            message.success("Patient registration successfully issued!");
            navigate("/patients");
          },
          (err) => {
            message.error(err || "Failed to register patient.");
          }
        );
      }
    } catch (err) {
      message.error(err?.message || "Failed to save patient record.");
    }
  };

  return (
    <FormContainer>
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={16}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
              <StyledButton
                variant="outlined"
                onClick={() => navigate("/patients")}
                sx={{ mr: 2 }}
              >
                <Icon name="arrow left" style={{ margin: 0 }} />
              </StyledButton>
              <Header as="h2" style={{ color: "#e8eaf6", margin: 0 }}>
                {isEdit ? "Edit Patient Record" : "Add New Patient Profile"}
              </Header>
            </div>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={16}>
            <StyledCard>
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                  first_name: "",
                  last_name: "",
                  gender: "",
                  date_of_birth: "",
                  age: "",
                  blood_group: "",
                  email: "",
                  phone: "",
                  address: "",
                  emergency_contact: "",
                  allergies: "",
                  medical_history: "",
                }}
              >
                {error && (
                  <StyledAlert severity="error" style={{ marginBottom: "20px" }}>
                    {error}
                  </StyledAlert>
                )}

                <SectionHeader>Personal Details</SectionHeader>
                <Grid columns={3} stackable>
                  <Grid.Row>
                    <Grid.Column>
                      <Form.Item
                        name="first_name"
                        rules={[{ required: true, message: "First name is required" }]}
                      >
                        <StyledTextField label="First Name" placeholder="e.g. Jane" />
                      </Form.Item>
                    </Grid.Column>
                    <Grid.Column>
                      <Form.Item
                        name="last_name"
                        rules={[{ required: true, message: "Last name is required" }]}
                      >
                        <StyledTextField label="Last Name" placeholder="e.g. Doe" />
                      </Form.Item>
                    </Grid.Column>
                    <Grid.Column>
                      <Form.Item name="gender">
                        <StyledTextField select label="Gender">
                          <MenuItem value="">Select Gender</MenuItem>
                          <MenuItem value="male">Male</MenuItem>
                          <MenuItem value="female">Female</MenuItem>
                          <MenuItem value="other">Other</MenuItem>
                        </StyledTextField>
                      </Form.Item>
                    </Grid.Column>
                  </Grid.Row>

                  <Grid.Row style={{ paddingTop: 0 }}>
                    <Grid.Column>
                      <Form.Item name="date_of_birth">
                        <StyledTextField
                          label="Date of Birth"
                          type="date"
                          slotProps={{ inputLabel: { shrink: true } }}
                        />
                      </Form.Item>
                    </Grid.Column>
                    <Grid.Column>
                      <Form.Item name="age">
                        <StyledTextField label="Age (Years)" placeholder="e.g. 29" type="number" />
                      </Form.Item>
                    </Grid.Column>
                    <Grid.Column>
                      <Form.Item name="blood_group">
                        <StyledTextField select label="Blood Group">
                          <MenuItem value="">Select Blood Group</MenuItem>
                          <MenuItem value="A+">A+</MenuItem>
                          <MenuItem value="A-">A-</MenuItem>
                          <MenuItem value="B+">B+</MenuItem>
                          <MenuItem value="B-">B-</MenuItem>
                          <MenuItem value="AB+">AB+</MenuItem>
                          <MenuItem value="AB-">AB-</MenuItem>
                          <MenuItem value="O+">O+</MenuItem>
                          <MenuItem value="O-">O-</MenuItem>
                        </StyledTextField>
                      </Form.Item>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>

                <SectionHeader>Contact Details</SectionHeader>
                <Grid columns={2} stackable>
                  <Grid.Row>
                    <Grid.Column>
                      <Form.Item
                        name="email"
                        rules={[
                          { required: true, message: "Email is required" },
                          { type: "email", message: "Enter a valid email" },
                        ]}
                      >
                        <StyledTextField label="Email Address" placeholder="e.g. jane.doe@example.com" />
                      </Form.Item>
                    </Grid.Column>
                    <Grid.Column>
                      <Form.Item
                        name="phone"
                        rules={[
                          {
                            pattern: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/,
                            message: "Enter a valid phone number",
                          },
                        ]}
                      >
                        <StyledTextField label="Phone Number" placeholder="e.g. +91 98765 43210" />
                      </Form.Item>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row style={{ paddingTop: 0 }}>
                    <Grid.Column width={16}>
                      <Form.Item name="address">
                        <StyledTextField
                          label="Residential Address"
                          placeholder="Enter residential street, city details"
                          multiline
                          rows={2}
                        />
                      </Form.Item>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>

                <SectionHeader>Medical & Emergency Contact Information</SectionHeader>
                <Grid columns={2} stackable>
                  <Grid.Row>
                    <Grid.Column>
                      <Form.Item name="emergency_contact">
                        <StyledTextField
                          label="Emergency Contact Name/Phone"
                          placeholder="e.g. Spouse: +91 98765 01234"
                        />
                      </Form.Item>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row style={{ paddingTop: 0 }}>
                    <Grid.Column>
                      <Form.Item name="allergies">
                        <StyledTextField
                          label="Known Allergies"
                          placeholder="e.g. Peanuts, Penicillin (If none, leave blank)"
                          multiline
                          rows={2}
                        />
                      </Form.Item>
                    </Grid.Column>
                    <Grid.Column>
                      <Form.Item name="medical_history">
                        <StyledTextField
                          label="Significant Medical History"
                          placeholder="e.g. Diabetes, Hypertension (If none, leave blank)"
                          multiline
                          rows={2}
                        />
                      </Form.Item>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>

                {!isEdit && (
                  <>
                    <SectionHeader>Patient Portal Credentials (Optional)</SectionHeader>
                    <Grid columns={2} stackable>
                      <Grid.Row>
                        <Grid.Column>
                          <Form.Item
                            name="password"
                            rules={[{ min: 8, message: "Password must be at least 8 characters" }]}
                          >
                            <StyledTextField
                              label="Account Password"
                              placeholder="Leave blank to default to 'Patient@123'"
                              type={showPassword ? "text" : "password"}
                              slotProps={{
                                input: {
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                        sx={{ color: "#9094a6" }}
                                      >
                                        <Icon name={showPassword ? "eye" : "eye slash"} style={{ fontSize: "16px", margin: 0 }} />
                                      </IconButton>
                                    </InputAdornment>
                                  )
                                }
                              }}
                            />
                          </Form.Item>
                        </Grid.Column>
                        <Grid.Column>
                          <Form.Item
                            name="confirm_password"
                            dependencies={["password"]}
                            rules={[
                              ({ getFieldValue }) => ({
                                validator(_, value) {
                                  if (!value || getFieldValue("password") === value) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(new Error("Passwords do not match"));
                                },
                              }),
                            ]}
                          >
                            <StyledTextField
                              label="Confirm Password"
                              placeholder="Re-enter password"
                              type={showConfirmPassword ? "text" : "password"}
                              slotProps={{
                                input: {
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <IconButton
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        edge="end"
                                        sx={{ color: "#9094a6" }}
                                      >
                                        <Icon name={showConfirmPassword ? "eye" : "eye slash"} style={{ fontSize: "16px", margin: 0 }} />
                                      </IconButton>
                                    </InputAdornment>
                                  )
                                }
                              }}
                            />
                          </Form.Item>
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                  </>
                )}

                <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
                  <StyledButton variant="outlined" onClick={() => navigate("/patients")}>
                    Cancel
                  </StyledButton>
                  <StyledButton variant="contained" type="submit" disabled={loading}>
                    {loading ? "Saving..." : isEdit ? "Update Patient" : "Register Patient"}
                  </StyledButton>
                </Box>
              </Form>
            </StyledCard>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </FormContainer>
  );
}
