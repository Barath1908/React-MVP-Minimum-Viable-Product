// import { useEffect } from "react";

// import useUsers from "../hooks/useUsers";

// import UserTable from "../components/UserTable";

// const UserManagement = () => {

//     const {

//         users,

//         loading,

//         getUsers,

//     } = useUsers();

//     useEffect(() => {

//         getUsers();

//     }, []);

//     return (

//         <div>

//             <h2>User Management</h2>

//             <UserTable

//                 users={users}

//                 loading={loading}

//             />

//         </div>

//     );

// };

// export default UserManagement;

import { useEffect, useState } from "react";

import { Button, Dialog, DialogTitle, DialogContent } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import UserTable from "../components/UserTable";
import UserForm from "../components/UserForm";
import useUsers from "../hooks/useUsers";

const UserManagement = () => {

    const {
        users,
        loading,
        fetchUsers,
        createUser,
        updateUser,
        deleteUser
    } = useUsers();

    const [open, setOpen] = useState(false);

    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {

        fetchUsers();

    }, []);

    const handleAddClick = () => {

        setEditingUser(null);

        setOpen(true);

    };

    const handleEdit = (user) => {

        setEditingUser(user);

        setOpen(true);

    };

    const handleDelete = (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (confirmDelete) {

            deleteUser(id);

        }

    };

    const handleClose = () => {

        setOpen(false);

        setEditingUser(null);

    };

    const handleSubmit = (values) => {

        if (editingUser) {

            updateUser(editingUser.id, values);

        } else {

            createUser(values);

        }

        handleClose();

    };

    return (

        <div style={{ padding: "20px" }}>

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "20px"
                }}
            >

                <h2>User Management</h2>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddClick}
                >
                    Add User
                </Button>

            </div>

            <UserTable
                users={users}
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

                    {editingUser
                        ? "Edit User"
                        : "Add User"}

                </DialogTitle>

                <DialogContent>

                    <UserForm
                        editingUser={editingUser}
                        onSubmit={handleSubmit}
                        onCancel={handleClose}
                    />

                </DialogContent>

            </Dialog>

        </div>

    );

};

export default UserManagement;