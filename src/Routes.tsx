import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import Landing from "./pages/user/Landing";
import OtpEntry from "./pages/auth/OtpEntry";
import PaymentSuccess from "./pages/user/subscription/PaymentSuccess";
import PaymentFailure from "./pages/user/subscription/PaymentFailed";
import ProVersionPayment from "./pages/user/subscription/ProVersionPayment";
import Dashboard from "./pages/user/Dashboard";
import Profile from "./pages/user/profile/Profile";
import ChatLayout from "./pages/user/chat/ChatLayout";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import Completeprofile from "./pages/user/profile/Completeprofile";
import ChangePassword from "./components/signup/ChangePassword";
import GeneralInfo from "./components/profile/Generalnfo";
import Security from "./components/profile/Security";
import Billing from "./components/profile/Billing";
import Notification from "./components/profile/NotificationSettings";
import ChatPage from "./pages/user/chat/ChatPage";
import CallLayout from "./pages/user/Call/CallLayout";
import CallRoomPage from "./pages/user/Call/CallRoomPage";
import BlogLayout from "./pages/user/blog/BlogLayout";
import BlogListing from "./pages/user/blog/BlogListing";
import BlogDetail from "./pages/user/blog/BlogDetail";
import MyBlog from "./pages/user/blog/MyBlog";
import MyBlogDetail from "./pages/user/blog/MyBlogDetails";
import EventLayout from "./pages/user/events/EventLayout";
import EventDash from "./pages/user/events/EventDash";
import PastEvents from "./pages/user/events/PastEvents";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<SignUp />} />
    <Route path="/otp-entry" element={<OtpEntry />} />
    <Route path="/changepassword" element={<ChangePassword />} />
    <Route element={<ProtectedRoutes />}>
      <Route path="/home" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />}>
        <Route path="general-info" element={<GeneralInfo />} />
        <Route path="security" element={<Security />} />
        <Route path="billing" element={<Billing />} />
        <Route path="notification" element={<Notification />} />
      </Route>
      <Route path="/chat" element={<ChatLayout />}>
        <Route path=":chatType" element={<ChatPage />} />
      </Route>
      <Route path="/audio-call" element={<CallLayout />} />
      <Route path="/call-room/:roomId" element={<CallRoomPage />} />
      <Route path="/completeprofile" element={<Completeprofile />} />
      <Route path="/payment-start" element={<ProVersionPayment />} />
      <Route path="/payment-failed" element={<PaymentFailure />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />

      <Route path="/blog" element={<BlogLayout />}>
        <Route index element={<BlogListing />} />
        <Route path="all-blogs/:blogId" element={<BlogDetail />} />
        <Route path="my-blog/:blogId" element={<MyBlogDetail />} />
        <Route path="my-blogs" element={<MyBlog />} />
      </Route>
      <Route path="/event" element={<EventLayout />}>
        <Route index element={<EventDash/>} />
        <Route  path="/event/past" element={<PastEvents/>} />
      </Route>
      <Route path="*" element={<Navigate to="/home" />} />
    </Route>
    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
);

export default AppRoutes;
