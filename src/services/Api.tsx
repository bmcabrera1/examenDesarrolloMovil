// src/services/Api.ts

// ==================== TIPOS DE DATOS ====================
export type SysUser = {
  record: number;
  id: number;
  lastnames: string;
  names: string;
  mail: string;
  phone: string;
  user: string;
};

export type AttendanceItem = {
  record: number;
  date: string;
  time: string;
  join_date: string;
};

// ==================== URL BASE ====================
const BASE_URL = "/api/examen.php";

// ==================== FUNCIONES HTTP ====================
async function httpGet<T>(
  url: string,
  params?: Record<string, string>
): Promise<T> {
  const query = params
    ? `${url}${url.includes("?") ? "&" : "?"}${new URLSearchParams(params)}`
    : url;

  const res = await fetch(query, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  const text = await res.text();

  if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0, 120)}`);

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`Respuesta no-JSON: ${text.slice(0, 200)}`);
  }
}

async function httpPost<T>(url: string, body: any): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });

  const text = await res.text();

  if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0, 120)}`);

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`Respuesta no-JSON: ${text.slice(0, 200)}`);
  }
}

// ==================== FUNCIONES DE API ====================

/**
 * Login de usuario
 * @param user - nombre de usuario
 * @param pass - contraseña / cédula
 */
export async function login(
  user: string,
  pass: string
): Promise<SysUser | null> {
  const data = await httpGet<SysUser[]>(BASE_URL, { user, pass });

  if (Array.isArray(data) && data.length > 0) return data[0];

  return null;
}

/**
 * Listar asistencias de un usuario
 * @param record_user - ID interno del usuario
 */
export async function listAttendanceApi(
  record_user: number
): Promise<AttendanceItem[]> {
  const data = await httpGet(BASE_URL, { record: String(record_user) });
  const arr = Array.isArray(data) ? data : [];

  return arr
    .map((d: any) => ({
      record: Number(d.record),
      date: String(d.date),
      time: String(d.time),
      join_date: String(d.join_date || `${d.date} ${d.time}`),
    }))
    .sort((a, b) => (a.join_date < b.join_date ? 1 : -1));
}

/**
 * Registrar nueva asistencia
 * @param record_user - ID interno del usuario
 * @param join_user - cédula del usuario
 */
export async function registerAttendanceApi(
  record_user: number,
  join_user: string
) {
  return httpPost(BASE_URL, { record_user, join_user });
}
