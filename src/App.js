import './App.css'
import { Route, Routes } from "react-router-dom"
import ManagerLogin from "./manager/login/Login"
import Manager from "./manager/Manager"
import FrontEnd from "./frontEnd/FrontEnd"
import ProtectedManagerRoute from "./manager/ProtectedManagerRoute"
import FrontEndLogin from "./frontEnd/login/Login"
import ProtectedFrontEndRoute from "./frontEnd/ProtectedFrontEndRoute"


function App() {
    return (
        <Routes>

            <Route path="/manager" element={<Manager />}>
                <Route index element={<ManagerLogin />} />
                <Route path="*" element={<ProtectedManagerRoute />} />
            </Route>

            <Route path="/" element={<FrontEnd />}>
                <Route index element={<FrontEndLogin />} />
                <Route path="*" element={<ProtectedFrontEndRoute />} />
            </Route>

        </Routes>
    )
}

export default App