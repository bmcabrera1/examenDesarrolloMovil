import React, { useState } from "react";
import {
  IonContent,
  IonPage,
  IonInput,
  IonButton,
  IonLabel,
  IonItem,
  IonToast,
  IonSpinner,
  IonIcon,
  IonCard,
  IonCardContent,
  IonText,
  IonRippleEffect,
  useIonRouter, // Mantengo tu router
} from "@ionic/react";
import {
  personCircleOutline,
  lockClosedOutline,
  schoolOutline,
  eyeOutline,
  eyeOffOutline,
  checkmarkCircleOutline,
  alertCircleOutline,
  logInOutline,
} from "ionicons/icons";
import { login } from "../services/Api"; // Mantengo tu servicio de API

import "./Login.css"; // Usaremos tu archivo CSS

const Login: React.FC = () => {
  const router = useIonRouter();

  // Estados combinados de ambos códigos
  const [user, setUser] = useState<string>("");
  const [pass, setPass] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    color: string;
  }>({
    show: false,
    message: "",
    color: "danger",
  });

  // Tu función handleLogin original, sin cambios
  const handleLogin = async () => {
    if (!user.trim() || !pass.trim()) {
      setToast({
        show: true,
        message: "Por favor, ingresa tu usuario y contraseña.",
        color: "warning",
      });
      return;
    }

    setIsLoading(true);
    try {
      const userData = await login(user.trim(), pass.trim());
      if (userData) {
        localStorage.setItem("USER_DATA", JSON.stringify(userData));
        setToast({
          show: true,
          message: `¡Bienvenido, ${userData.names}!`,
          color: "success",
        });
        router.push("/asistencia", "forward", "replace");
      } else {
        throw new Error("Usuario o contraseña incorrectos.");
      }
    } catch (error: any) {
      console.error("Error en el login:", error);
      setToast({
        show: true,
        message: error.message || "Error al conectar con el servidor.",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <IonPage>
      <IonContent fullscreen className="login-page">
        {/* Fondo animado */}
        <div className="background-animation">
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
            <div className="shape shape-4"></div>
            <div className="shape shape-5"></div>
          </div>
        </div>

        <div className="login-container">
          <IonCard className="login-card">
            <IonCardContent className="login-card-content">
              {/* Encabezado */}
              <div className="login-header">
                <div className="logo-wrapper">
                  <div className="logo-container">
                    <IonIcon icon={schoolOutline} className="logo-icon" />
                  </div>
                  <div className="logo-glow"></div>
                </div>
                <h1 className="login-title">
                  <span className="title-gradient">Bienvenido</span>
                </h1>
                <p className="login-subtitle">
                  Accede a tu portal de asistencia
                </p>
              </div>

              {/* Formulario de Login */}
              <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <IonItem lines="none" className="modern-input">
                    <div className="input-icon-wrapper" slot="start">
                      <IonIcon
                        icon={personCircleOutline}
                        className="input-icon"
                      />
                    </div>
                    <IonLabel position="stacked" className="input-label">
                      Usuario
                    </IonLabel>
                    <IonInput
                      type="text"
                      value={user}
                      onIonInput={(e) => setUser(e.detail.value!)}
                      placeholder="Ingresa tu usuario"
                      className="custom-input"
                      clearInput={true}
                    />
                    <IonRippleEffect></IonRippleEffect>
                  </IonItem>
                </div>

                <div className="form-group">
                  <IonItem lines="none" className="modern-input">
                    <div className="input-icon-wrapper" slot="start">
                      <IonIcon
                        icon={lockClosedOutline}
                        className="input-icon"
                      />
                    </div>
                    <IonLabel position="stacked" className="input-label">
                      Contraseña
                    </IonLabel>
                    <IonInput
                      type={showPassword ? "text" : "password"}
                      value={pass}
                      onIonInput={(e) => setPass(e.detail.value!)}
                      placeholder="Ingresa tu contraseña"
                      className="custom-input"
                    />
                    <IonButton
                      fill="clear"
                      slot="end"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <IonIcon
                        icon={showPassword ? eyeOffOutline : eyeOutline}
                        className="toggle-icon"
                      />
                    </IonButton>
                    <IonRippleEffect></IonRippleEffect>
                  </IonItem>
                </div>

                {/* Botón de Login */}
                <div className="button-group">
                  <IonButton
                    expand="block"
                    className="login-button"
                    disabled={isLoading || !user.trim() || !pass.trim()}
                    onClick={handleLogin}
                  >
                    <div className="button-content">
                      {isLoading ? (
                        <>
                          <IonSpinner
                            name="crescent"
                            className="button-spinner"
                          />
                          <span className="button-text">Validando...</span>
                        </>
                      ) : (
                        <>
                          <IonIcon
                            icon={logInOutline}
                            className="button-icon"
                          />
                          <span className="button-text">Iniciar Sesión</span>
                        </>
                      )}
                    </div>
                    <IonRippleEffect></IonRippleEffect>
                  </IonButton>
                </div>
              </form>
            </IonCardContent>
          </IonCard>
        </div>

        {/* Toast mejorado */}
        <IonToast
          isOpen={toast.show}
          message={toast.message}
          onDidDismiss={() => setToast({ ...toast, show: false })}
          duration={3000}
          color={toast.color}
          position="top"
          buttons={[
            {
              icon:
                toast.color === "success"
                  ? checkmarkCircleOutline
                  : alertCircleOutline,
              side: "start",
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;
