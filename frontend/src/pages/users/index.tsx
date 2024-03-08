import Datatable from '../../components/datatable'
import Breadcrumb from '../../components/Breadcrumb'
import useFetch from '../../hooks/useFetch';
import endpoint from '../../utils/endpoints';
import { UserColumns, cssOverride, primaryColor } from '../../utils/constant';
import { useEffect, useState } from 'react';
import { PulseLoader } from 'react-spinners';
import Modal from '../../components/modals';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { toast } from 'react-toastify';
import UserForm from './form';
import { capitalizeFirstLetter } from '../../utils/functions';
import { remove, reset } from '../../features/admin/adminSlice';

type Props = {
    userCategory?: string;
    role?: string;
}

const Users = (props: Props) => {
    const {userCategory, role} = props;
  const [openModal, setOpenModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [mode, setMode] = useState<any>("Create");
  const dispatch = useDispatch<AppDispatch>();

  const { data: submittedData, isLoading, isError, isSuccess, message: msg } = useSelector(
    (state: RootState) => state.admin
  );


  const url = userCategory ? `userCategory=${userCategory}` : `role=${role}`;
  const word = userCategory ? userCategory! : role!;
 const { data, loading, message, success, fetchData, } = useFetch(`${endpoint.ADMIN}?${url}`);
//   console.log(data);
  const value = Array.isArray(data?.data) && data?.data

  const createUser = () => {
    setMode("Create");
    setUser(null)
    setOpenModal(true);
  };

  const editUser = (item: any) => {
    setMode("Edit");
    setUser(item)
    setOpenModal(true);
  };

  const viewUser = (item: any) => {
    setMode("View");
    setUser(item)
    setOpenModal(true);
  };

  const cancelUser = (item: any) => {
    setUser(item)
    setMode("Delete");
    setOpenModal(true);
  };

  useEffect(() => {
    if (isError) {
        setOpenModal(false);
        toast.error(msg);
    }

    if (isSuccess) {
        setOpenModal(false)
        msg !== "" && toast.success(msg);
        setFormSubmitted(true);
    }

    dispatch(reset());
}, [submittedData, isError, isSuccess, msg, dispatch]);

  useEffect(() => {
    // Check if formSubmitted is true and then refetch the features API
    if (formSubmitted) {
      fetchData();
    }
    setFormSubmitted(false);
  }, [formSubmitted]);

  if (loading) {
    return (
      <PulseLoader
        color={primaryColor}
        loading={loading}
        cssOverride={cssOverride}
      // size={150}
      />
    );
  }

  const onDelete = () => {
    console.log({userId: user?.userId})
    dispatch(remove(user?.userId))
  }


  return (
    <>
      {!loading && data !== null && (
        <div className="mx-auto max-w-270">
          <Breadcrumb pageName={`View ${capitalizeFirstLetter(word)}`} />
          <Datatable
            list={value}
            columns={UserColumns}
            title={capitalizeFirstLetter(word)}
            idColumnName={"userId"}
            showFilter={false}
            createButton={createUser}
            editButton={editUser}
            viewButton={viewUser}
            cancelButton={cancelUser}
          />
        </div>
      )}

      <Modal
        showModal={openModal}
        setShowModal={setOpenModal}
        title={`${mode} ${capitalizeFirstLetter(word)}`}
        id={user?.userId}
        onSubmit={onDelete}
        mode={mode === "Delete" ? "alert" : "form"}
        body={mode === "Delete" ?
          <p>Are you sure you want to {mode.toLowerCase()} this {word}? Please note that this will be {mode.toLowerCase()}d permanently.</p>
          : <UserForm mode={mode} FormName={capitalizeFirstLetter(word)} form={user} setOpenModal={setOpenModal} setFormSubmitted={setFormSubmitted} />}
        isLoading={false}
      />
    </>
  )
}

export default Users;