import { File } from "lucide-react";
import CustomButton from "../../../../components/CustomButton";
import useAuth from "../../../../hooks/useAuth";

const Dashboard = () => {
  const { auth } = useAuth();
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div className="mb-3 sm:mb-0">
          <h1 className="font-[700] text-[25px] capitalize">
            Hello, {auth?.role}
          </h1>
          <p>Here is an overview of your dashboard</p>
        </div>

        <CustomButton
          label="Export Report"
          icon={<File />}
          variant="contained"
          onClick={() => {}}
        />
      </div>
    </div>
  );
};
export default Dashboard;
