import { Routes, Route, Navigate, Outlet, Form } from "react-router-dom";
import Topbar from "./pages/Topbar";
// import Services from "./components/Services";
import Activate from "./components/Activate";
import Error404 from "./components/Error404";
import PasswordReset from "./components/PasswordReset";
import ConfirmPassword from "./components/ConfirmPassword";
import { AuthProvider } from "./context/AuthContext";
import SignUp from "./components/SignUp";
import Authform from "./components/Authform";
import { SnackbarProvider } from "notistack";
import PrivateRoute from "./utils/PrivateRoute";
import { CssBaseline, Table } from "@mui/material";
import Dashboard from "./pages/Dashboard";
import Payment from "./pages/Payment";
import Services from "./pages/service/Services";
import ServiceRequest from "./pages/ServiceRequest";
import Employee from "./pages/staff/employee/Employee";
import Department from "./pages/staff/department/Department";
import Apointment from "./pages/Apointment";
import ClientType from "./pages/ClientType";
import ClientInfo from "./pages/ClientInfo";
import UserAccount from "./pages/UserAccount";
import Certificate from "./pages/Certificate";
import Calendar from "./pages/Calendar";
import Kanban from "./pages/Kanban";
import Chat from "./pages/Chat";
import Report from "./pages/Report";
import TextEditor from "./pages/TextEditor";
// import ServiceList from "./pages/Servicelist/ServiceList";
// import CrudTable from "./pages/servicelists/CrudTable";
import { ServiceTypes } from "./pages/service/Servicetype/ServiceTypes";
import Service from "./pages/service/servicelist/Service";
import { QueryClient, QueryClientProvider } from "react-query";
const queryClient = new QueryClient();
const App = () => {
  return (
    <>
      <QueryClientProvider client={queryClient} contextSharing={true}>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <CssBaseline />
          <AuthProvider>
            <Routes>
              <Route
                path="/login"
                component={Authform}
                element={<Authform />}
              />
              <Route path="/signup" component={SignUp} element={<SignUp />} />
              <Route path="passwordReset" element={<PasswordReset />} />
              <Route path="activate/:uid/:token" element={<Activate />} />
              <Route
                path="password/reset/confirm/:uid/:token"
                element={<ConfirmPassword />}
              />
              <Route path="*" element={<Error404 />} />
              <Route element={<PrivateRoute />}>
                <Route path="/" element={<Topbar />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/services" element={<Services />}>
                    <Route
                      index
                      path="/services/service-list"
                      element={<Service />}
                    />

                    <Route path="/services/type" element={<ServiceTypes />} />
                  </Route>
                  <Route path="/department" element={<Department />} />
                  <Route path="/employee" element={<Employee />} />
                  <Route path="/client">
                    <Route index path="/client/type" element={<ClientType />} />
                    <Route path="/client/info" element={<ClientInfo />} />
                  </Route>
                  <Route path="/apointment" element={<Apointment />} />
                  <Route path="/payment" element={<Payment />} />
                  <Route path="/account" element={<UserAccount />} />
                  <Route path="/service-request" element={<ServiceRequest />} />
                  <Route path="/cirtificate" element={<Certificate />} />
                  <Route path="/report" element={<Report />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/kanban" element={<Kanban />} />
                  <Route path="/text-editor" element={<TextEditor />} />
                  <Route path="/chat" element={<Chat />} />
                </Route>
              </Route>
            </Routes>
          </AuthProvider>
        </SnackbarProvider>
      </QueryClientProvider>
    </>
  );
};

export default App;
