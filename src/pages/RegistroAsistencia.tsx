import React from "react";
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonToast,
  IonFab,
  IonFabButton,
  IonIcon,
  IonModal,
  IonButton,
  IonInput,
  IonText,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonLabel,
  IonAvatar,
  IonBadge,
  IonGrid,
  IonRow,
  IonCol,
  IonRippleEffect,
} from "@ionic/react";
import {
  add,
  calendarOutline,
  closeCircleOutline,
  checkmarkDoneCircleOutline,
  timeOutline,
  documentTextOutline,
  shieldCheckmarkOutline,
  fingerPrintOutline,
  statsChartOutline,
  refreshOutline,
} from "ionicons/icons";
import { useAttendance } from "../hooks/HookRegistro";
import "./RegistroAsistencia.css";

const RegistroAsistencia: React.FC = () => {
  const {
    isLoading,
    attendanceList,
    userData,
    showToast,
    isRegistering,
    showModal,
    digitIndices,
    digit1,
    digit2,
    verificationError,
    setShowToast,
    setShowModal,
    setDigit1,
    setDigit2,
    handleRefresh,
    openRegisterModal,
    handleRegister,
  } = useAttendance();

  const diasSemana = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  const getStatusColor = (date: string) => {
    const today = new Date();
    const recordDate = new Date(date);
    today.setHours(0, 0, 0, 0);
    recordDate.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - recordDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "success";
    if (diffDays <= 2) return "warning";
    return "medium";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Hoy";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Ayer";
    } else {
      return date.toLocaleDateString("es-EC", {
        day: "2-digit",
        month: "short",
      });
    }
  };

  const getInitials = (names: string, lastnames: string) => {
    if (!names || !lastnames) return "";
    return `${names.charAt(0)}${lastnames.charAt(0)}`.toUpperCase();
  };

  return (
    <IonPage>
      <IonHeader className="modern-header">
        <IonToolbar className="header-toolbar">
          <IonTitle className="header-title">
            <div className="title-content">
              <IonIcon icon={statsChartOutline} className="title-icon" />
              <span>Mis Asistencias</span>
            </div>
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="attendance-page">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent
            pullingIcon={refreshOutline}
            pullingText="Desliza para actualizar"
            refreshingSpinner="crescent"
            refreshingText="Actualizando..."
          />
        </IonRefresher>

        {userData && (
          <IonCard className="user-stats-card">
            <IonCardContent>
              <div className="user-info">
                <IonAvatar className="user-avatar">
                  <div className="avatar-content">
                    {getInitials(userData.names, userData.lastnames)}
                  </div>
                </IonAvatar>
                <div className="user-details">
                  <h3 className="user-name">
                    {userData.names} {userData.lastnames}
                  </h3>
                  <div className="attendance-stats">
                    <IonChip color="primary" className="stat-chip">
                      <IonIcon icon={checkmarkDoneCircleOutline} />
                      <IonLabel>{attendanceList.length} registros</IonLabel>
                    </IonChip>
                  </div>
                </div>
              </div>
            </IonCardContent>
          </IonCard>
        )}

        <div className="attendance-container">
          {isLoading ? (
            <div className="loading-state">
              <div className="loading-content">
                <IonSpinner name="crescent" className="loading-spinner" />
                <IonText className="loading-text">
                  Cargando registros...
                </IonText>
              </div>
            </div>
          ) : attendanceList.length > 0 ? (
            <div className="attendance-list">
              <IonGrid>
                {attendanceList.map((item) => {
                  const fecha = new Date(item.date);
                  const diaNombre = diasSemana[fecha.getUTCDay()];
                  const statusColor = getStatusColor(item.date);
                  return (
                    <IonRow key={item.record}>
                      <IonCol size="12">
                        <IonCard className="attendance-card">
                          <IonCardContent>
                            <div className="attendance-item">
                              <div className="attendance-date">
                                <div className="date-circle">
                                  <IonIcon
                                    icon={calendarOutline}
                                    className="date-icon"
                                  />
                                </div>
                                <div className="date-info">
                                  <div className="day-name">{diaNombre}</div>
                                  <div className="date-formatted">
                                    {formatDate(item.date)}
                                  </div>
                                </div>
                              </div>
                              <div className="attendance-details">
                                <div className="time-section">
                                  <IonIcon
                                    icon={timeOutline}
                                    className="time-icon"
                                  />
                                  <div className="time-info">
                                    <div className="time-label">
                                      Hora de entrada
                                    </div>
                                    <div className="time-value">
                                      {item.time}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="attendance-status">
                                <IonBadge
                                  color={statusColor}
                                  className="status-badge"
                                >
                                  <IonIcon
                                    icon={checkmarkDoneCircleOutline}
                                    className="status-icon"
                                  />
                                  Registrado
                                </IonBadge>
                              </div>
                            </div>
                          </IonCardContent>
                          <IonRippleEffect />
                        </IonCard>
                      </IonCol>
                    </IonRow>
                  );
                })}
              </IonGrid>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-content">
                <div className="empty-icon-wrapper">
                  <IonIcon icon={documentTextOutline} className="empty-icon" />
                </div>
                <IonText className="empty-text">
                  <h2>¡Comienza tu registro!</h2>
                  <p>
                    Aún no tienes asistencias. Presiona el botón flotante para
                    marcar una.
                  </p>
                </IonText>
                <IonButton
                  fill="outline"
                  className="empty-action-button"
                  onClick={openRegisterModal}
                >
                  <IonIcon icon={add} slot="start" />
                  Registrar Asistencia
                </IonButton>
              </div>
            </div>
          )}
        </div>

        <IonFab
          vertical="bottom"
          horizontal="end"
          slot="fixed"
          className="modern-fab"
        >
          <IonFabButton onClick={openRegisterModal} className="fab-button">
            <IonIcon icon={add} className="fab-icon" />
            <IonRippleEffect />
          </IonFabButton>
        </IonFab>

        <IonModal
          isOpen={showModal}
          onDidDismiss={() => setShowModal(false)}
          className="verification-modal"
        >
          <IonHeader className="modal-header">
            <IonToolbar className="modal-toolbar">
              <IonTitle className="modal-title">
                <IonIcon
                  icon={shieldCheckmarkOutline}
                  className="modal-title-icon"
                />
                Verificación de Seguridad
              </IonTitle>
              <IonButton
                slot="end"
                fill="clear"
                onClick={() => setShowModal(false)}
                className="modal-close-button"
              >
                <IonIcon icon={closeCircleOutline} />
              </IonButton>
            </IonToolbar>
          </IonHeader>
          <IonContent className="modal-content">
            <div className="verification-container">
              <div className="verification-header">
                <div className="verification-icon-wrapper">
                  <IonIcon
                    icon={fingerPrintOutline}
                    className="verification-icon"
                  />
                </div>
                <IonText className="verification-description">
                  <h3>Verificación de Identidad</h3>
                  <p>Ingresa los dígitos solicitados de tu número de cédula:</p>
                </IonText>
              </div>
              <div className="input-section">
                <IonCard className="input-card">
                  <IonCardContent>
                    <div className="digit-inputs">
                      <div className="input-group">
                        <IonLabel className="input-label">
                          Dígito #{digitIndices.pos1 + 1}
                        </IonLabel>
                        <IonInput
                          type="number"
                          maxlength={1}
                          placeholder="•"
                          value={digit1}
                          onIonInput={(e) => setDigit1(e.detail.value!)}
                          className="verification-input"
                        />
                      </div>
                      <div className="input-separator">
                        <div className="separator-line"></div>
                      </div>
                      <div className="input-group">
                        <IonLabel className="input-label">
                          Dígito #{digitIndices.pos2 + 1}
                        </IonLabel>
                        <IonInput
                          type="number"
                          maxlength={1}
                          placeholder="•"
                          value={digit2}
                          onIonInput={(e) => setDigit2(e.detail.value!)}
                          className="verification-input"
                        />
                      </div>
                    </div>
                  </IonCardContent>
                </IonCard>
                {verificationError && (
                  <IonCard className="error-card">
                    <IonCardContent>
                      <IonText color="danger" className="error-text">
                        <IonIcon
                          icon={closeCircleOutline}
                          className="error-icon"
                        />
                        {verificationError}
                      </IonText>
                    </IonCardContent>
                  </IonCard>
                )}
              </div>
              <div className="action-section">
                <IonButton
                  expand="block"
                  onClick={handleRegister}
                  disabled={isRegistering || !digit1 || !digit2}
                  className="verify-button"
                >
                  <div className="button-content">
                    {isRegistering ? (
                      <>
                        <IonSpinner
                          name="crescent"
                          className="button-spinner"
                        />
                        <span>Verificando...</span>
                      </>
                    ) : (
                      <>
                        <IonIcon
                          icon={checkmarkDoneCircleOutline}
                          className="button-icon"
                        />
                        <span>Verificar y Registrar</span>
                      </>
                    )}
                  </div>
                  <IonRippleEffect />
                </IonButton>
              </div>
            </div>
          </IonContent>
        </IonModal>

        <IonToast
          isOpen={showToast.show}
          message={showToast.message}
          onDidDismiss={() => setShowToast({ ...showToast, show: false })}
          duration={3000}
          color={showToast.color}
          position="top"
          buttons={[
            {
              icon:
                showToast.color === "success"
                  ? checkmarkDoneCircleOutline
                  : closeCircleOutline,
              side: "start",
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default RegistroAsistencia;
