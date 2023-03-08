// assets
import PersonIcon from "@mui/icons-material/Person";
import GroupsIcon from "@mui/icons-material/Groups";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import PaymentIcon from "@mui/icons-material/Payment";
import EventIcon from "@mui/icons-material/Event";
import ReceiptIcon from "@mui/icons-material/Receipt";
import HailIcon from "@mui/icons-material/Hail";

import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import DescriptionIcon from "@mui/icons-material/Description";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import ChatIcon from "@mui/icons-material/Chat";
import RttIcon from "@mui/icons-material/Rtt";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
export const dashboard = [
  {
    id: "dashboard",
    title: "Dashboard",
    type: "item",
    url: "/dashboard",
    icon: <DashboardRoundedIcon />,
    breadcrumbs: false,
  },
];
export const services = [
  {
    id: "table-services",
    title: "Services",
    type: "item",
    url: "/services",
    icon: <AddBusinessIcon />,
    breadcrumbs: false,
  },
  {
    id: "table-department",
    title: "Department",
    type: "item",
    url: "/department",
    icon: <WorkspacesIcon />,
  },
  {
    id: "table-employee",
    title: "Employee",
    type: "item",
    url: "/employee",
    icon: <PersonIcon />,
  },
  {
    id: "table-client",
    title: "Client",
    type: "item",
    url: "/client",
    icon: <GroupsIcon />,
    breadcrumbs: false,
  },
  {
    id: "table-apointment",
    title: "Apointment",
    type: "item",
    url: "/apointment",
    icon: <EventIcon />,
    breadcrumbs: false,
  },
  {
    id: "table-payment",
    title: "Payment",
    type: "item",
    url: "/payment",
    icon: <PaymentIcon />,
  },
  {
    id: "service-request",
    title: "Service Request",
    type: "item",
    url: "/service-request",
    icon: <HailIcon />,
  },
  {
    id: "cirtificate",
    title: "Cirtificate",
    type: "item",
    url: "/cirtificate",
    icon: <ReceiptIcon />,
  },
];

export const apps = [
  {
    id: "calendar",
    title: "Calendar",
    type: "item",
    url: "/calendar",
    icon: <CalendarMonthIcon />,
    breadcrumbs: false,
  },
  {
    id: "kanban",
    title: "Kanban",
    type: "item",
    url: "/kanban",
    icon: <ViewKanbanIcon />,
  },
  {
    id: "chat",
    title: "Chat",
    type: "item",
    url: "/chat",
    icon: <ChatIcon />,
  },
  {
    id: "text-editor",
    title: "Text Editor",
    type: "item",
    url: "/text-editor",
    icon: <RttIcon />,
  },
];
export const account = [
  {
    id: "account",
    title: "Account",
    type: "item",
    url: "/account",
    icon: <ManageAccountsIcon />,
    breadcrumbs: false,
  },
  {
    id: "report",
    title: "Report",
    type: "item",
    url: "/report",
    icon: <DescriptionIcon />,
  },
];
