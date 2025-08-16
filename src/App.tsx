import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

/* Importa tus páginas */
import Login from "./pages/Login";
import RegistroAsistencia from "./pages/RegistroAsistencia";

/* Estilos de Ionic */
import "@ionic/react/css/core.css";
/* ... otros estilos ... */

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        {/* TU PÁGINA DE LOGIN DEBE ESTAR AQUÍ DENTRO */}
        <Route exact path="/login">
          <Login />
        </Route>

        <Route exact path="/asistencia">
          <RegistroAsistencia />
        </Route>

        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
