import { useCallback, useEffect, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { FaTimes } from "react-icons/fa";
import { HiPhoto } from "react-icons/hi2";
import {
  FileObject,
  IBooking,
  IBoolean,
  IFormState,
  IString,
} from "../../utils/interfaces";
import { toast } from "react-toastify";
import { formatBytes } from "../../utils/functions";

type IDrop = {
  banner?: string[];
  className: string;
  id: string;
  touched?: IBoolean;
  maximumSize?: number;
  maxFiles?: number;
  multiple?: boolean;
  formErrors?: IString | any;
  images?: Array<any>;
  setImages?: (file: any) => void;
  setReceipt?: (file: any) => void;
};

const Dropzone = (props: IDrop) => {
  const {
    className,
    id,
    multiple,
    maximumSize,
    maxFiles,
    images,
    setImages,
    setReceipt,
  } = props;
  const [files, setFiles] = useState<any>([]);
  // const [image, setImage] = useState<any>([]);
  const [rejected, setRejected] = useState<any>([]);
  const maxSize = maximumSize ? maximumSize : 20 * 1024 * 1024; // 20MB
  const formattedSize = formatBytes(maxSize);

  const sizeValidator = (file: File) => {
    const message = `File size is larger than ${formattedSize}`;
    if (file.size > maxSize) {
      toast.error(message);
    }
    return null;
  };

  const onDropRejected = (fileRejections: FileRejection[]) => {
    fileRejections.forEach((file) => {
      file.errors.forEach((err) => {
        if (err.code === "file-too-large") {
          toast.error(
            `Error: ${err.message}. Please upload maximum of ${formattedSize}`
          );
        }

        if (err.code === "file-invalid-type") {
          toast.error(`Error: ${err.message}.`);
        }

        if (err.code === "file-too-small") {
          toast.error(`Error: ${err.message}`);
        }

        if (err.code === "too-many-files") {
          toast.error(
            `Error: ${err.message}. Please upload maximum of ${maxFiles} files`
          );
        }
      });
    });
  };

  if (rejected) {
    //console.log(rejected);
  }  

  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: Array<any>) => {
      const fileSizeCheck = acceptedFiles.filter(
        (file) => file.size <= maxSize
      ); //  limit

      // if (acceptedFiles.length !== fileSizeCheck.length) {
      //   toast.error(
      //     `File size exceeds ${formattedSize} limit. Please choose smaller files.`
      //   );
      // }

      if (acceptedFiles.length) {
        setFiles((previousFiles: any) => [
          ...previousFiles,
          ...acceptedFiles.map((file) =>
            Object.assign(file, { preview: URL.createObjectURL(file) })
          ),
        ]);
        const fileList: FileObject[] = [];

        await Promise.all(
          acceptedFiles.map(async (file) => {
            const base64Data = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onload = (event) => {
                resolve(event.target?.result?.toString().split(",")[1] || "");
              };
              reader.readAsDataURL(file);
            });

            fileList.push({
              name: file.name,
              type: file.type,
              size: file.size,
              data: base64Data,
            });
          })
        );

        // console.log(fileList);
        setImages &&
          setImages((previousFiles: FileObject[]) => [
            ...previousFiles,
            ...fileList,
          ]);
        setReceipt &&
          setReceipt((prevState: any) => ({
            ...prevState,
            params: {
              ...prevState.params,
              [id]: [...prevState?.params?.[id], ...fileList],
            },
          }));
      }

      if (rejectedFiles?.length) {
        setRejected((previousFiles: any) => [
          ...previousFiles,
          ...rejectedFiles,
        ]);
      }
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
    },
    maxSize,
    multiple: multiple ? multiple : true,
    maxFiles: maxFiles ? maxFiles : 1,
    validator: sizeValidator,
    onDropRejected: onDropRejected,
    onDrop,
  });

  useEffect(() => {
    // Revoke the data uris to avoid memory leaks
    return () =>
      files.forEach((file: any) => URL.revokeObjectURL(file.preview));
  }, [files]);

  const removeFile = (name: any) => {
    setFiles((files: FileObject[]) =>
      files.filter((file: FileObject) => file.name !== name)
    );
    setImages &&
      setImages((files: FileObject[]) =>
        files.filter((file: FileObject) => file.name !== name)
      );
    setReceipt &&
      setReceipt((prevState: IFormState) => ({
        ...prevState,
        params: {
          ...prevState.params,
          [id]: filterReceipt(prevState?.params?.receipt, name),
        },
      }));
  };

  const filterReceipt = (data: FileObject[], name: string) => {
    const filtered = data.filter((file: FileObject) => file.name !== name);
    console.log(filtered);
    return filtered;
  };

  const removeAll = () => {
    setFiles([]);
    setRejected([]);
    setImages && setImages([]);
    setReceipt &&
      setReceipt((prevState: IFormState) => ({
        ...prevState,
        params: {
          ...prevState.params,
          [id]: [],
        },
      }));
  };

  // if(images?.length === 0){
  //   setFiles([]);
  //   setRejected([]);
  // }

  return (
    <>
      <div
        {...getRootProps({
          className: className,
          id: id,
        })}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center justify-center space-y-3">
          {/* <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
            <BiUpload className="w-5 h-5 fill-current" />
          </span> */}
          <HiPhoto
            className="mx-auto h-12 w-12 text-gray-300"
            aria-hidden="true"
          />
          {isDragActive ? (
            <>
              <p>Drop the files here ...</p>
            </>
          ) : (
            <>
              <p>Drag & drop files here, or click to select files</p>
              <p className="text-xs leading-5 text-gray-600">
                PNG, JPG, JPEG up to {formattedSize}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Preview */}
      <section className="my-3">
        {/* Accepted files */}
        {files.length > 0 && (
          <div className="flex justify-between">
            <h3 className="title text-lg font-semibold text-neutral-600 pb-3">
              Preview
            </h3>
            <button
              type="button"
              onClick={removeAll}
              className="mt-1 text-[12px] tracking-wider font-bold text-neutral-500 border border-primary-400 rounded-md px-3 hover:bg-primary-400 hover:text-white transition-colors"
            >
              Remove all
            </button>
          </div>
        )}

        <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-10">
          {files.map((file: any) => (
            <li key={file.name} className="relative h-32 rounded-md shadow-lg">
              <img
                src={file.preview}
                alt={file.name}
                onLoad={() => {
                  URL.revokeObjectURL(file.preview);
                }}
                className="h-full w-full object-contain rounded-md"
              />
              <button
                type="button"
                className="w-7 h-7 border border-primary-400 bg-primary-400 rounded-full flex justify-center items-center absolute -top-3 -right-3 hover:bg-white transition-colors"
                onClick={() => removeFile(file.name)}
              >
                <FaTimes className="w-5 h-5 fill-white hover:fill-primary-400 transition-colors" />
              </button>
              <p className="mt-2 text-neutral-500 text-[12px] font-medium">
                {file.name}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default Dropzone;
