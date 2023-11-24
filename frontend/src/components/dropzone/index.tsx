import {
  ChangeEvent,
  useCallback,
  useEffect,
  useState,
  FormEvent,
} from "react";
import { useDropzone } from "react-dropzone";
import { BiUpload } from "react-icons/bi";
import { FaTimes } from "react-icons/fa";
import { HiPhoto } from "react-icons/hi2";
import { IBoolean, IString } from "../../utils/interfaces";
import { toast } from "react-toastify";

type IDrop = {
  banner?: string[];
  className: string;
  touched?: IBoolean;
  formErrors?: IString | any;
  setImages: (file: any) => void;
};

export interface FileObject {
  name: string;
  type: string;
  size: number;
  data: string;
}

const Dropzone = (props: IDrop) => {
  const { className, setImages } = props;
  const [files, setFiles] = useState<any>([]);
  const [rejected, setRejected] = useState<any>([]);
  const maxSize = 20 * 1024 * 1024; // 20MB

  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: Array<any>) => {
      const fileSizeCheck = acceptedFiles.filter(
        (file) => file.size <= maxSize
      ); // 10MB limit

      if (acceptedFiles.length !== fileSizeCheck.length) {
        toast.error(
          "File size exceeds 10MB limit. Please choose smaller files."
        );
      }

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

        console.log(fileList);
        setImages((previousFiles: any) => [...previousFiles, ...fileList]);
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
    //setImages((files: FileObject[]) => files.filter((file: FileObject) => file.name !== name));
  };

  const removeAll = () => {
    setFiles([]);
    setRejected([]);
    setImages([]);
  };

  return (
    <>
      <div
        {...getRootProps({
          className: className,
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
                PNG, JPG, JPEG up to 20MB
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
