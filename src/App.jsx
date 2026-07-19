import { AnimatePresence } from "framer-motion";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Landing from "./pages/Landing/Landing";
import Home from "./pages/Home/Home";
import Admin from "./pages/Admin/Admin";

function App() {

    const location = useLocation();

    return (

        <AnimatePresence
            mode="wait"
        >

            <Routes
                location={location}
                key={location.pathname}
            >

                <Route
                    path="/"
                    element={<Landing />}
                />

                <Route
                    path="/home"
                    element={<Home />}
                />

                <Route
                    path="/admin"
                    element={<Admin />}
                />

                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />

            </Routes>

        </AnimatePresence>

    );

}

export default App;