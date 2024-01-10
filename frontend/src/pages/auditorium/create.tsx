import React, {
  ChangeEvent,
  FormEvent,
  FormEventHandler,
  useEffect,
  useState,
} from "react";
import Breadcrumb from "../../components/Breadcrumb";
import {
  FileObject,
  IAuditorium,
  IBoolean,
  IReactSelect,
  IString,
} from "../../utils/interfaces";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { toast } from "react-toastify";
import { create, reset } from "../../features/auditoriums/auditoriumSlice";
import { PiWarehouseBold } from "react-icons/pi";
import { BiEdit } from "react-icons/bi";
import { TbCurrencyNaira } from "react-icons/tb";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import ButtonLoader from "../../components/buttonLoader";
import api, { useNavigateAndClearToken } from "../../utils/http";
import Dropzone from "../../components/dropzone";
import { BsPercent } from "react-icons/bs";

type Props = {};

const CreateAuditorium = (props: Props) => {
  const initialValue = {
    name: "",
    description: "",
    capacity: "",
    layout: "",
    price: 0,
    discount: 0,
    studentPrice: 0,
    vat: 0,
    cautionFee: 0,
    cleaningCharges: 0,
    features: [],
    active: true,
  };
  const initialValueBoolean = {
    name: false,
    price: false,
    description: false,
    discount: false,
    features: false,
    capacity: false,
  };
  const [formData, setFormData] = useState<IAuditorium>(initialValue);
  const [formErrors, setFormErrors] = useState<IString>();
  const [touched, setTouched] = useState<IBoolean>(initialValueBoolean);
  const [disabled, setDisabled] = useState(true);
  const [allFeatures, setAllFeatures] = useState([]);
  const [images, setImages] = useState<FileObject[]>([]);
  const {
    name,
    description,
    capacity,
    price,
    discount,
    studentPrice,
    vat,
    cautionFee,
    cleaningCharges,
    features,
    active,
  } = formData;

  const dispatch = useDispatch<AppDispatch>();
  const navigateAndClearToken = useNavigateAndClearToken();

  const { data, isLoading, isError, isSuccess, message } = useSelector(
    (state: any) => state.auditorium
  );

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const onCheckBoxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: checked }));
  };

  const onFocus = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
  };

  const onMultiSelectChange = (props: {
    name: string;
    value: IReactSelect[] | any;
  }) => {
    const { name, value } = props;
    console.log(value);
    const newValues = value.map((option: any) => option.value);
    setFormData((prevState) => ({ ...prevState, [name]: newValues }));
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    console.log(formData);
    console.log(images);
    const allimages = {
      images: images,
    };
    const params = { ...formData, ...allimages };
    console.log(params);
    dispatch(create(params));
  };

  const onReset = () => {
    setFormData(initialValue);
  };

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess && data != null) {
      // if response is Success
      toast.success(message);
      console.log(data);
      // reset all values
      setFormData(initialValue);
    }
    dispatch(reset());
  }, [data, isError, isSuccess, message, dispatch]);

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      const url = "/api/features";
      const response = await api.get(url);
      setAllFeatures(response.data.data);
    } catch (error: any) {
      console.log(error);
      if (
        error.response &&
        error.response.status === 401 &&
        error.response.statusText === "Unauthorized"
      ) {
        // Handle token expiration, e.g., redirect to the login page
        navigateAndClearToken();
      } else {
        toast.error("Features could not be fetched");
      }
    }
  };

  // Transform the country data into the format required by react-select
  const allFeatures1 = allFeatures.map((f: any) => ({
    value: f.id,
    label: f.name,
  }));

  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Create Auditorium" />

      <div className="grid grid-cols-4 gap-8">
        <div className="col-span-7 xl:col-span-3">
          <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Create Auditorium
              </h3>
            </div>
            <div className="p-7">
              <form onSubmit={onSubmit}>
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="name"
                    >
                      Auditorium Name
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <PiWarehouseBold />
                      </span>
                      <input
                        className="inputClass"
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Afe Babalola"
                        value={name}
                        onChange={onChange}
                        onFocus={onFocus}
                      />
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="capacity"
                    >
                      Capacity
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <PiWarehouseBold />
                      </span>
                      <input
                        className="inputClass"
                        type="number"
                        name="capacity"
                        id="capacity"
                        placeholder="1000"
                        value={capacity}
                        onChange={onChange}
                        onFocus={onFocus}
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="price"
                    >
                      Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <TbCurrencyNaira />
                      </span>
                      <input
                        className="inputClass"
                        type="number"
                        name="price"
                        id="price"
                        placeholder="50000"
                        value={price}
                        onChange={onChange}
                        onFocus={onFocus}
                      />
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="discount"
                    >
                      Discount
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <BsPercent />
                      </span>
                      <input
                        className="inputClass"
                        type="number"
                        name="discount"
                        id="discount"
                        value={discount}
                        onChange={onChange}
                        onFocus={onFocus}
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="studentPrice"
                    >
                      Student Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <TbCurrencyNaira />
                      </span>
                      <input
                        className="inputClass"
                        type="number"
                        name="studentPrice"
                        id="studentPrice"
                        placeholder="50000"
                        value={studentPrice}
                        onChange={onChange}
                        onFocus={onFocus}
                      />
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="cleaningCharges"
                    >
                      Cleaning Charges
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <TbCurrencyNaira />
                      </span>

                      <input
                        className="inputClass"
                        type="number"
                        name="cleaningCharges"
                        id="cleaningCharges"
                        value={cleaningCharges}
                        onChange={onChange}
                        onFocus={onFocus}
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="cautionFee"
                    >
                      Caution Fee
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <TbCurrencyNaira />
                      </span>
                      <input
                        className="inputClass"
                        type="number"
                        name="cautionFee"
                        id="cautionFee"
                        placeholder="50000"
                        value={cautionFee}
                        onChange={onChange}
                        onFocus={onFocus}
                      />
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="vat"
                    >
                      VAT
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <BsPercent />
                      </span>
                      <input
                        className="inputClass"
                        type="number"
                        name="vat"
                        id="vat"
                        value={vat}
                        onChange={onChange}
                        onFocus={onFocus}
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="features"
                  >
                    Features
                  </label>
                  <Select
                    isMulti
                    name="features"
                    options={allFeatures1}
                    className="basic-multi-select text-sm"
                    classNamePrefix="react-select"
                    onChange={(e) =>
                      onMultiSelectChange({ name: "features", value: e })
                    }
                  />
                </div>

                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="description"
                  >
                    Description
                  </label>
                  <div className="relative">
                    <span className="absolute left-4.5 top-4">
                      <BiEdit />
                    </span>
                    <textarea
                      className="inputClass"
                      name="description"
                      id="description"
                      rows={6}
                      placeholder="Type description here"
                      value={description}
                      onChange={onChange}
                      onFocus={onFocus}
                    ></textarea>
                  </div>
                </div>

                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full">
                    <div className="relative">
                      <label className="inputLabelClass" htmlFor="images">
                        Event Banner
                      </label>
                      <Dropzone
                        maxFiles={30}
                        id={"images"}
                        multiple={true}
                        setImages={setImages}
                        touched={touched}
                        className="dropzoneClass"
                      />
                    </div>
                  </div>
                </div>

                <div className="relative mb-3">
                  <label className="inputLabelClass" htmlFor="title">
                    Set Active
                  </label>
                </div>

                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <label
                    htmlFor="active"
                    className="flex cursor-pointer select-none items-center"
                  >
                    <div className="relative">
                      <input
                        type="checkbox"
                        id="active"
                        name="active"
                        className="sr-only"
                        onChange={onCheckBoxChange}
                        checked={active}
                      />
                      <div className="block h-8 w-14 rounded-full bg-meta-9 dark:bg-[#5A616B]"></div>
                      <div
                        className={`dot absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition ${
                          active &&
                          "!right-1 !translate-x-full !bg-primary-700 dark:!bg-white"
                        }`}
                      >
                        <span className={`hidden ${active && "!block"}`}>
                          <svg
                            className="fill-white dark:fill-black"
                            width="11"
                            height="8"
                            viewBox="0 0 11 8"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                              fill=""
                              stroke=""
                              strokeWidth="0.4"
                            ></path>
                          </svg>
                        </span>
                        <span className={`${active && "hidden"}`}>
                          <svg
                            className="h-4 w-4 stroke-current"
                            fill="none"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            ></path>
                          </svg>
                        </span>
                      </div>
                    </div>
                  </label>
                </div>

                <div className="flex justify-end gap-4.5">
                  <button
                    className="resetButton"
                    type="button"
                    onClick={onReset}
                  >
                    Reset
                  </button>
                  <button className="protectedSubmitButton" type="submit">
                    <ButtonLoader
                      isLoading={isLoading}
                      text="Submit"
                      loadingText="Loading"
                    />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* <div className="col-span-5 xl:col-span-2">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Your Photo
              </h3>
            </div>
            <div className="p-7">
              <form action="#">
                <div className="mb-4 flex items-center gap-3">
                  <div>
                    <span className="mb-1.5 text-black dark:text-white">
                      Edit your photo
                    </span>
                    <span className="flex gap-2.5">
                      <button className="text-sm hover:text-primary-500">
                        Delete
                      </button>
                      <button className="text-sm hover:text-primary-500">
                        Update
                      </button>
                    </span>
                  </div>
                </div>

                <div
                  id="FileUpload"
                  className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border-2 border-dashed border-primary-500 bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5"
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                  />
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                          fill="#3C50E0"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                          fill="#3C50E0"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                          fill="#3C50E0"
                        />
                      </svg>
                    </span>
                    <p>
                      <span className="text-primary-500">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="mt-1.5">SVG, PNG, JPG or GIF</p>
                    <p>(max, 800 X 800px)</p>
                  </div>
                </div>

                <div className="flex justify-end gap-4.5">
                  <button
                    className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                    type="submit"
                  >
                    Cancel
                  </button>
                  <button
                    className="flex justify-center rounded bg-primary-700 py-2 px-6 font-medium text-gray hover:bg-opacity-70"
                    type="submit"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default CreateAuditorium;
