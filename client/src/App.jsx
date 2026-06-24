import {BrowserRouter , Routes,Route} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { Toaster, ToastBar } from 'react-hot-toast';

function App() {

  return (
    <>
     <div>

        <Toaster>
              {(t) => (
                <ToastBar
                  toast={t}
                  style={{
                    ...t.style,
                    animation: t.visible
                      ? 'custom-enter 1s ease'
                      : 'custom-exit 1s ease forwards',
                  }}
                />
              )}
          </Toaster>;
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/signup" element={<Signup/>}/>

          </Routes>
        </BrowserRouter>
     </div>
    </>
  )
}

export default App
