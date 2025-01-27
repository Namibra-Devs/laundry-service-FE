import { File } from "lucide-react";
import CustomButton from "../../../../components/CustomButton";
import DashboardCard from "../components/DashboardCard";
import {
  ShoppingCart,
  Building2,
  HeartHandshakeIcon,
  Users,
} from "lucide-react";
import OverviewGraph from "../components/OverviewGraph";
import useAuth from "@/hooks/useAuth";
import useAppContext from "@/hooks/useAppContext";

const Dashboard = () => {
  const { staff, branches, services, customers, items, orders } =
    useAppContext();

  const today = new Date().toISOString().split("T")[0];
  const todayOrders = orders?.filter((order) => {
    const orderDate = new Date(order?.createdAt).toISOString().split("T")[0];
    return orderDate === today;
  });

  function getPreviousMonthItems(data) {
    const now = new Date();

    const firstDayOfPrevMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );
    const lastDayOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const previousMonthItems = data?.filter((item) => {
      const createdAtDate = new Date(item?.createdAt);
      return (
        createdAtDate >= firstDayOfPrevMonth &&
        createdAtDate <= lastDayOfPrevMonth
      );
    });

    return previousMonthItems;
  }

  const preStaff = getPreviousMonthItems(staff);
  const preBranches = getPreviousMonthItems(branches);
  const preServices = getPreviousMonthItems(services);
  const preCustomers = getPreviousMonthItems(customers);
  const preOrders = getPreviousMonthItems(orders);

  console.log("staff", staff);
  console.log("branches", branches);
  console.log("services", services);
  console.log("customers", customers);
  console.log("items", items);
  console.log("orders", orders);

  const {
    auth: { user },
  } = useAuth();

  function calculateMetric(currentValue, previousValue) {
    if (!previousValue || previousValue === 0) {
      return currentValue > 0 ? "100" : "0";
    }
    const change = ((currentValue - previousValue) / previousValue) * 100;
    return change.toFixed(1);
  }

  const cardDetails = [
    {
      label: "total orders",
      icon: <ShoppingCart />,
      count: orders?.length ?? "-",
      metric: calculateMetric(orders?.length || 0, preOrders?.length || 0),
    },
    {
      label: "total customers",
      icon: <Users />,
      count: customers?.length ?? "-",
      metric: calculateMetric(
        customers?.length || 0,
        preCustomers?.length || 0
      ),
    },
    {
      label: "total branches",
      icon: <Building2 />,
      count: branches?.length ?? "-",
      metric: calculateMetric(branches?.length || 0, preBranches?.length || 0),
    },
    {
      label: "total staff",
      icon: <Users />,
      count: staff?.length ?? "-",
      metric: calculateMetric(staff?.length || 0, preStaff?.length || 0),
    },
    {
      label: "total services",
      icon: <HeartHandshakeIcon />,
      count: services?.length ?? "-",
      metric: calculateMetric(services?.length || 0, preServices?.length || 0),
    },
    {
      label: "today's orders",
      icon: <ShoppingCart />,
      count: todayOrders?.length ?? "-",
    },
  ];

  const data = [
    { name: "Jan", orders: 0 },
    { name: "Feb", orders: 0 },
    { name: "Mar", orders: 0 },
    { name: "Apr", orders: 0 },
    { name: "May", orders: 0 },
    { name: "Jun", orders: 0 },
    { name: "Jul", orders: 0 },
    { name: "Aug", orders: 0 },
    { name: "Sep", orders: 0 },
    { name: "Oct", orders: 0 },
    { name: "Nov", orders: 0 },
    { name: "Dec", orders: 0 },
  ];

  orders?.forEach((order) => {
    const date = new Date(order.createdAt);
    const monthIndex = date.getMonth();
    data[monthIndex].orders += 1;
  });

  const exportData = () => {
    alert("exporting data");
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div className="mb-3 sm:mb-0">
          <h1 className="font-[700] text-[25px] capitalize">
            Hello, {user?.name}
          </h1>
          <p>Here is an overview of your dashboard</p>
        </div>

        <CustomButton
          label="Export Report"
          icon={<File />}
          variant="contained"
          onClick={exportData}
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

      <div className="custom_box_shadow py-5 sm:p-5 rounded-lg">
        <p className="text-xl mb-5 px-2 sm:p-0">Orders per month</p>
        <div className="graphContainer w-[390px] sm:w-full h-[500px] overflow-x-scroll">
          <OverviewGraph data={data} />
        </div>
      </div>
    </>
  );
};
export default Dashboard;
