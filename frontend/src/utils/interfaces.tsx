import { ChangeEvent } from "react";

export type ILogin = {
  email: string;
  password: string;
  [key: string]: string;
};

export type IRegister = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userCategory: string;
  userCategoryId?: string;
  confirmPassword?: string;
  phone: string;
  terms: boolean;
  [key: string]: string | boolean | undefined;
};

export type IUser = {
  firstName: string;
  lastName: string;
  email: string;
  image?: {
    url: string | any;
    publicId: string;
  };
};

export type IForgotPassword = {
  email: string;
  [key: string]: string;
};

export type IResetPassword = {
  password: string;
  confirmPassword: string;
  [key: string]: string;
};

export interface IRequest {
  data: any;
  isLoading: boolean;
  isFullLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
  type?: string;
}

export type IVerifyOTP = {
  otp: string;
};

export type IBoolean = {
  [key: string]: boolean;
};

export type IString = {
  [key: string]: string;
};

export interface IAuditorium {
  name: string;
  description: string;
  capacity: string;
  price: number;
  discount: number;
  vat: number;
  cautionFee: number;
  cleaningCharges: number;
  studentPrice: number;
  layout?: string;
  features: any[];
  active: boolean;
  images?: FileObject[];
}

export interface IReactSelect {
  value: string;
  label: string;
  __isNew__?: boolean;
}

export interface FileObject {
  name: string;
  type: string;
  size: number;
  data: string;
}

export interface AuditoriumResponse {
  id: number;
  audID: string;
  name: string;
  description: string;
  layout: string;
  capacity: string;
  price: number;
  discount: number;
  vat?: string;
  cautionFee?: string;
  cleaningCharges?: string;
  studentPrice?: string;
  active: boolean;
  images: Array<any>;
  features: Array<any>;
  dateCreated: string;
  dateUpdated: string;
  userID: string;
}

export interface IBooking {
  name: IReactSelect;
  audId?: string;
  purpose: string;
  type: number;
  remarks: string;
  approved: boolean;
  start: IEventDate;
  end: IEventDate;
  available: boolean;
  features: any[];
  discount: string;
  paymentMethod: IReactSelect;
  receipt: FileObject[];
  paymentStatus: boolean;
  payment?: IPaymentDetails;
}

export interface IPaymentDetails {
  totalAmount: number;
  cautionFee: number;
  cleaningCharges: number;
  vat: string;
  eventDays: number;
}

export interface IEventDate {
  date: Date | null;
  time: Date | null;
}

export type IStepFormState = {
  mount?: boolean;
  currentStep: number;
  formErrors: IString | any;
  disabled: IBoolean;
};

export type IBookingBoolean = {
  name: boolean;
  remarks: boolean;
  purpose: boolean;
  type: boolean;
  start: IBooleanDate;
  end: IBooleanDate;
  available: boolean;
  [key: string]: boolean | IBooleanDate | any;
};

export type IBooleanDate = {
  date: boolean;
  time: boolean;
};

export interface IStep {
  [key: string]: boolean;
}

export interface IFormState {
  mount: boolean;
  currentStep: number;
  params: IBooking;
  formErrors: Record<string, string>;
  touched: IBookingBoolean;
  disabled: IStep;
}

export interface ICustomSelect {
  name: string;
  type?: string;
  value: IReactSelect;
}

export interface IDateFocus {
  e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
  name: string;
  type?: string;
}

export interface IDateProps {
  value: Date;
  name: "start" | "end";
  type?: string;
}

export interface IFeature {
  audFeatureID: number;
  featureID: number;
  audID: string;
  name: string;
}

export interface ISection {
  name: string;
  link: string;
  icon: any;
  count?: number;
  badge?: string;
  submenus?: Array<any> | undefined;
}

export interface IMenu {
  name: string;
  section: ISection[];
}

export interface IupdateProfile {
  firstName: string;
  lastName: string;
  phone: string;
}
