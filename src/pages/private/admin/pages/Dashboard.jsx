import { File } from "lucide-react";
import CustomButton from "../../../../components/CustomButton";
import useAuth from "../../../../hooks/useAuth";
import DashboardCard from "../components/DashboardCard";
import {
  ShoppingCart,
  Building2,
  HeartHandshakeIcon,
  Users,
} from "lucide-react";

const Dashboard = () => {
  const { auth } = useAuth();

  const cardDetails = [
    {
      label: "total orders",
      icon: <ShoppingCart />,
      count: 89,
      metric: +21,
    },
    {
      label: "total customers",
      icon: <Users />,
      count: 89,
      metric: +21,
    },
    {
      label: "total branches",
      icon: <Building2 />,
      count: 89,
      metric: +21,
    },
    {
      label: "total staff",
      icon: <Users />,
      count: 89,
      metric: +21,
    },
    {
      label: "total services",
      icon: <HeartHandshakeIcon />,
      count: 89,
    },
    {
      label: "today's orders",
      icon: <ShoppingCart />,
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

      <div className="flex flex-wrap my-5 gap-3">
        {cardDetails?.map((cardItem, index) => (
          <DashboardCard
            key={index}
            icon={cardItem?.icon}
            label={cardItem?.label}
            count={cardItem?.count}
            metric={cardItem?.metric}
          />
        ))}
      </div>
    </>
  );
};
export default Dashboard;
