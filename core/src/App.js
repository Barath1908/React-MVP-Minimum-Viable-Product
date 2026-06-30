import UserManagement from "./modules/users/pages/UserManagement";
import StaffManagement from "./modules/staff/pages/StaffManagement";
import RoleManagement from "./modules/staffRoles/pages/RoleManagement";
import chatManagement from "./modules/chat/pages/ChatManagement";
import InvoiceManagement from "./modules/billing/pages/InvoiceManagement";
import NotificationManagement from "./modules/notifications/pages/NotificationManagement";
import PrescriptionManagement from "./modules/prescriptions/pages/PrescriptionManagement";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <UserManagement />

      <hr />

      <StaffManagement />

      <hr />

      <RoleManagement />

      <hr />

      <chatManagement />

      <hr />

      <InvoiceManagement />

      <hr />

      <NotificationManagement />

      <hr />

      <PrescriptionManagement />
    </div>
  );
}

export default App;
