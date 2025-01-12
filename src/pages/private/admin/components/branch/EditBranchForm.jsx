import useAppContext from "@/hooks/useAppContext";

const EditBranchForm = () => {
  const { currentItem: branch } = useAppContext();

  return <div>Editing Branch: {branch?.name}</div>;
};

export default EditBranchForm;
