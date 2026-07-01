import {
  useEffect,
  useState,
} from "react";

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import RoleTable from "../components/RoleTable";
import RoleForm from "../components/RoleForm";

import useRoles from "../hooks/useRoles";

const RoleManagement = () => {
  const {
    roles,
    loading,
    fetchRoles,
    createRole,
    updateRole,
    deleteRole,
  } = useRoles();

  const [open, setOpen] =
    useState(false);

  const [editingRole, setEditingRole] =
    useState(null);

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleAddClick = () => {
    setEditingRole(null);
    setOpen(true);
  };

  const handleEdit = (role) => {
    setEditingRole(role);
    setOpen(true);
  };

  const handleDelete = (id) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this role?"
      );

    if (confirmDelete) {
      deleteRole(id);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditingRole(null);
  };

  const handleSubmit = (
    values
  ) => {
    if (editingRole) {
      updateRole(
        editingRole.id,
        values
      );
    } else {
      createRole(values);
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
        <h2>
          Staff Role
          Management
        </h2>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={
            handleAddClick
          }
        >
          Add Role
        </Button>
      </div>

      <RoleTable
        roles={roles}
        loading={loading}
        onEdit={handleEdit}
        onDelete={
          handleDelete
        }
      />

      <Dialog
        open={open}
        onClose={
          handleClose
        }
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editingRole
            ? "Edit Role"
            : "Add Role"}
        </DialogTitle>

        <DialogContent>
          <RoleForm
            editingRole={
              editingRole
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

export default RoleManagement;