import React from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Employee from "./Pages/Employee";
import { useSelector } from "react-redux";

const ProtectedRoute = ({element: Component}) => {
  const auth = useSelector((x) => x.user.token);
  if(!auth){
   return <Navigate to="/" replace /> 
  }
  return <Component />
}

const AppRoutes = () => {
  
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/employee" element={<ProtectedRoute element={Employee}/>} />
        </Routes>
      </Router>
    </div>
  );
};

export default AppRoutes;
