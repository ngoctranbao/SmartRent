import "./App.css";
import { HashRouter } from "react-router-dom";
import Guest from "./pages/Guest";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "@fontsource/inter"; // Defaults to weight 400

function App() {
  return (
    <HashRouter>
      <Guest />
      <ToastContainer
        position="top-right"
        autoClose={2000}
        newestOnTop={true}
        closeOnClick
        pauseOnHover={false}
        pauseOnFocusLoss={false}
        draggable
        style={{ textAlign: "left" }}
      />
    </HashRouter>
  );
}

export default App;
