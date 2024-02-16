import Datatable from '../../components/datatable'
import Breadcrumb from '../../components/Breadcrumb'
import useFetch from '../../hooks/useFetch';
import endpoint from '../../utils/endpoints';
import { cssOverride, featureColumns, primaryColor } from '../../utils/constant';
import { useEffect, useState } from 'react';
import { PulseLoader } from 'react-spinners';
import Modal from '../../components/modals';
import FeatureForm from './form';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { remove, reset } from '../../features/features/featureSlice';
import { toast } from 'react-toastify';

type Props = {}

const Features = (props: Props) => {
  const [openModal, setOpenModal] = useState(false);
  const [feature, setFeature] = useState<any>(null);
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [mode, setMode] = useState<any>("Create");
  const dispatch = useDispatch<AppDispatch>();

  const { data: submittedData, isLoading, isError, isSuccess, message: msg } = useSelector(
    (state: RootState) => state.feature
  );

  const {
    data,
    loading,
    message,
    success,
    fetchData,
  } = useFetch(endpoint.FEATURES);
  const value = Array.isArray(data?.data) && data?.data

  const createFeature = () => {
    setMode("Create");
    setFeature(null)
    setOpenModal(true);
  };

  const editFeature = (item: any) => {
    setMode("Edit");
    setFeature(item)
    setOpenModal(true);
  };

  const viewFeature = (item: any) => {
    setMode("View");
    setFeature(item)
    setOpenModal(true);
  };

  const cancelFeature = (item: any) => {
    setFeature(item)
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
    dispatch(remove(feature?.id))
  }



  return (
    <>
      {!loading && data !== null && (
        <div className="mx-auto max-w-270">
          <Breadcrumb pageName="View Features" />
          <Datatable
            list={value?.slice()?.reverse()}
            columns={featureColumns}
            title={"Feature"}
            idColumnName={"id"}
            showFilter={false}
            createButton={createFeature}
            editButton={editFeature}
            viewButton={viewFeature}
            cancelButton={cancelFeature}
          />
        </div>
      )}

      <Modal
        showModal={openModal}
        setShowModal={setOpenModal}
        title={`${mode} Feature`}
        id={feature?.id}
        onSubmit={onDelete}
        mode={mode === "Delete" ? "alert" : "form"}
        body={mode === "Delete" ?
          <p>Are you sure you want to {mode.toLowerCase()} this feature? Please note that this will be {mode.toLowerCase()}d permanently.</p>
          : <FeatureForm mode={mode} FormName={"Feature"} form={feature} setOpenModal={setOpenModal} setFormSubmitted={setFormSubmitted} />}
        isLoading={false}
      />
    </>
  )
}

export default Features;