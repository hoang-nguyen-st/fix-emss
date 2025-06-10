export interface ProjectExternalData {
  id: string;
  name: string;
}

export interface AccountExternalData {
  id: string;
  email: string;
  nickName: string;
  phoneNumber: string;
  roleName: string;
}

export interface DeviceExternalData {
  tenantCode: string;
  name: string;
  projectId: string;
  sensorId: string;
  description: string;
  location: string;
  deviceBrand: number;
  systemType: number;
  dataType: string;
  brand: string;
  sensorModel: string;
  devEUI: string;
  alias: string;
  equipmentName: string;
  iot: boolean;
}

export interface ZoneExternalData {
  projectId: string;
  name: string;
}
