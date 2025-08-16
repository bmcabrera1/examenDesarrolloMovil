import { useState, useEffect, useCallback } from "react";
import {
  SysUser,
  AttendanceItem,
  listAttendanceApi,
  registerAttendanceApi,
} from "../services/Api";

export const useAttendance = () => {
  const [userData, setUserData] = useState<SysUser | null>(null);
  const [attendanceList, setAttendanceList] = useState<AttendanceItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    color: "danger",
  });

  const [showModal, setShowModal] = useState<boolean>(false);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [digitIndices, setDigitIndices] = useState({ pos1: 0, pos2: 0 });
  const [digit1, setDigit1] = useState<string>("");
  const [digit2, setDigit2] = useState<string>("");
  const [verificationError, setVerificationError] = useState<string>("");

  const fetchAttendance = useCallback(async (recordId: number) => {
    try {
      const data = await listAttendanceApi(recordId);
      setAttendanceList(data);
    } catch (error: any) {
      setShowToast({
        show: true,
        message: error.message || "No se pudo cargar la lista.",
        color: "danger",
      });
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const storedUserData = localStorage.getItem("USER_DATA");
      if (storedUserData) {
        const parsedData: SysUser = JSON.parse(storedUserData);
        setUserData(parsedData);
        await fetchAttendance(parsedData.record);
      }
      setIsLoading(false);
    };
    loadData();
  }, [fetchAttendance]);

  const handleRefresh = async (event: CustomEvent) => {
    if (userData) await fetchAttendance(userData.record);
    event.detail.complete();
  };

  const openRegisterModal = () => {
    if (!userData || String(userData.id).length < 2) return;
    const cedula = String(userData.id);
    let pos1 = Math.floor(Math.random() * cedula.length);
    let pos2;
    do {
      pos2 = Math.floor(Math.random() * cedula.length);
    } while (pos1 === pos2);
    setDigitIndices({ pos1: Math.min(pos1, pos2), pos2: Math.max(pos1, pos2) });
    setDigit1("");
    setDigit2("");
    setVerificationError("");
    setShowModal(true);
  };

  const handleRegister = async () => {
    if (!userData) return;
    const { pos1, pos2 } = digitIndices;
    const cedula = String(userData.id);

    if (digit1 === cedula[pos1] && digit2 === cedula[pos2]) {
      setIsRegistering(true);
      setVerificationError("");
      try {
        await registerAttendanceApi(userData.record, cedula);
        setShowToast({
          show: true,
          message: "Asistencia registrada con éxito.",
          color: "success",
        });
        setShowModal(false);
        await fetchAttendance(userData.record);
      } catch (error: any) {
        setShowToast({
          show: true,
          message: error.message || "Error al registrar la asistencia.",
          color: "danger",
        });
      } finally {
        setIsRegistering(false);
      }
    } else {
      setVerificationError("Los dígitos no coinciden. Inténtalo de nuevo.");
    }
  };

  return {
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
  };
};
