import { File } from "lucide-react";
import CustomButton from "../../../../components/CustomButton";
import useAuth from "../../../../hooks/useAuth";
import DashboardCard from "../components/DashboardCard";
import { ShoppingBag } from "lucide-react";
import { Building2 } from "lucide-react";
import { Users } from "lucide-react";

const Dashboard = () => {
  const { auth } = useAuth();

  const cardDetails = [
    {
      label: "total orders",
      icon: <ShoppingBag />,
      count: 89,
    },
    {
      label: "total customers",
      icon: <ShoppingBag />,
      count: 89,
    },
    {
      label: "total branches",
      icon: <Building2 />,
      count: 89,
    },
    {
      label: "total staff",
      icon: <Users />,
      count: 89,
    },
  ];

  return (
    <>
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

      <div className="grid grid-cols-4 gap-3 my-5">
        {cardDetails?.map((cardItem, index) => (
          <DashboardCard
            key={index}
            icon={cardItem?.icon}
            label={cardItem?.label}
            count={cardItem?.count}
          />
        ))}
      </div>
    </>
  );
};
export default Dashboard;
