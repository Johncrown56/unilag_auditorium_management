import Datatable from '../../components/datatable'
import Breadcrumb from '../../components/Breadcrumb'
import useFetch from '../../hooks/useFetch';
import endpoint from '../../utils/endpoints';
import { categoryColumns, cssOverride, primaryColor } from '../../utils/constant';
import { useEffect, useState } from 'react';
import { PulseLoader } from 'react-spinners';
import Modal from '../../components/modals';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { toast } from 'react-toastify';
import CategoryForm from './form';
import { remove, reset } from '../../features/categories/categorySlice';

type Props = {}

const Categories = (props: Props) => {
  const [openModal, setOpenModal] = useState(false);
  const [category, setCategory] = useState<any>(null);
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [mode, setMode] = useState<any>("Create");
  const dispatch = useDispatch<AppDispatch>();

  const { data: submittedData, isLoading, isError, isSuccess, message: msg } = useSelector(
    (state: RootState) => state.category
  );

  const { data, loading, message, success, fetchData } = useFetch(endpoint.EVENTS);
  const value = Array.isArray(data?.data) && data?.data

  const createCategory = () => {
    setMode("Create");
    setCategory(null)
    setOpenModal(true);
  };

  const editCategory = (item: any) => {
    setMode("Edit");
    setCategory(item)
    setOpenModal(true);
  };

  const viewCategory = (item: any) => {
    setMode("View");
    setCategory(item)
    setOpenModal(true);
  };

  const cancelCategory = (item: any) => {
    setCategory(item)
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
    // Check if formSubmitted is true and then refetch the categorys API
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
    dispatch(remove(category?.id))
  }



  return (
    <>
      {!loading && data !== null && (
        <div className="mx-auto max-w-270">
          <Breadcrumb pageName="View Categories" />
          <Datatable
            list={value?.slice()?.reverse()}
            columns={categoryColumns}
            title={"Category"}
            idColumnName={"id"}
            showFilter={false}
            createButton={createCategory}
            editButton={editCategory}
            viewButton={viewCategory}
            cancelButton={cancelCategory}
          />
        </div>
      )}

      <Modal
        showModal={openModal}
        setShowModal={setOpenModal}
        title={`${mode} Category`}
        id={category?.id}
        onSubmit={onDelete}
        mode={mode === "Delete" ? "alert" : "form"}
        body={mode === "Delete" ?
          <p>Are you sure you want to {mode.toLowerCase()} this category? Please note that this will be {mode.toLowerCase()}d permanently.</p>
          : <CategoryForm mode={mode} FormName={"Category"} form={category} setOpenModal={setOpenModal} setFormSubmitted={setFormSubmitted} />}
        isLoading={false}
      />
    </>
  )
}

export default Categories;