import { useEffect, useState } from "react";

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import StaffTable from "../components/StaffTable";
import StaffForm from "../components/StaffForm";

import useStaff from "../hooks/useStaff";

const StaffManagement = () => {
  const {
    staff,
    loading,
    fetchStaff,
    createStaff,
    updateStaff,
    deleteStaff,
  } = useStaff();

  const [open, setOpen] =
    useState(false);

  const [editingStaff, setEditingStaff] =
    useState(null);

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleAddClick = () => {
    setEditingStaff(null);
    setOpen(true);
  };

  const handleEdit = (staff) => {
    setEditingStaff(staff);
    setOpen(true);
  };

  const handleDelete = (id) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this staff?"
      );

    if (confirmDelete) {
      deleteStaff(id);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditingStaff(null);
  };

  const handleSubmit = (values) => {
    if (editingStaff) {
      updateStaff(
        editingStaff.id,
        values
      );
    } else {
      createStaff(values);
    }

    handleClose();
  };

  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          marginBottom: 20,
        }}
      >
        <h2>Staff Management</h2>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
        >
          Add Staff
        </Button>
      </div>

      <StaffTable
        staff={staff}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editingStaff
            ? "Edit Staff"
            : "Add Staff"}
        </DialogTitle>

        <DialogContent>
          <StaffForm
            editingStaff={
              editingStaff
            }
            onSubmit={
              handleSubmit
            }
            onCancel={
              handleClose
            }
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffManagement;