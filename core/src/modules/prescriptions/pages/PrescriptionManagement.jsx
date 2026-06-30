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

import PrescriptionTable from "../components/PrescriptionTable";
import PrescriptionForm from "../components/PrescriptionForm";

import usePrescriptions from "../hooks/usePrescriptions";

const PrescriptionManagement =
  () => {
    const {
      prescriptions,
      loading,
      fetchPrescriptions,
      createPrescription,
      updatePrescription,
      deletePrescription,
    } =
      usePrescriptions();

    const [open, setOpen] =
      useState(false);

    const [
      editingPrescription,
      setEditingPrescription,
    ] = useState(null);

    useEffect(() => {
      fetchPrescriptions();
    }, []);

    const handleAddClick =
      () => {
        setEditingPrescription(
          null
        );

        setOpen(true);
      };

    const handleEdit = (
      prescription
    ) => {
      setEditingPrescription(
        prescription
      );

      setOpen(true);
    };

    const handleDelete = (
      id
    ) => {
      const confirmDelete =
        window.confirm(
          "Are you sure you want to delete this prescription?"
        );

      if (confirmDelete) {
        deletePrescription(id);
      }
    };

    const handleClose =
      () => {
        setOpen(false);

        setEditingPrescription(
          null
        );
      };

    const handleSubmit = (
      values
    ) => {
      if (
        editingPrescription
      ) {
        updatePrescription(
          editingPrescription.id,
          values
        );
      } else {
        createPrescription(
          values
        );
      }

      handleClose();
    };

    return (
      <div
        style={{
          padding: 20,
        }}
      >
        <div
          style={{
            display:
              "flex",
            justifyContent:
              "space-between",
            marginBottom: 20,
          }}
        >
          <h2>
            Prescription
            Management
          </h2>

          <Button
            variant="contained"
            startIcon={
              <AddIcon />
            }
            onClick={
              handleAddClick
            }
          >
            Add
            Prescription
          </Button>
        </div>

        <PrescriptionTable
          prescriptions={
            prescriptions
          }
          loading={loading}
          onEdit={
            handleEdit
          }
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
          maxWidth="md"
        >
          <DialogTitle>
            {editingPrescription
              ? "Edit Prescription"
              : "Add Prescription"}
          </DialogTitle>

          <DialogContent>
            <PrescriptionForm
              editingPrescription={
                editingPrescription
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

export default PrescriptionManagement;