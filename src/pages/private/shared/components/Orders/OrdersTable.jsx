import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ArrowLeft } from "lucide-react";
import { ArrowRight } from "lucide-react";
import PropTypes from "prop-types";
import { iconDictionary } from "@/lib/data/IconsDictionary";
import ViewToggle from "../OrdersViewToggle";
import { formatDate } from "@/lib/utils/formatDate";
import { deleteSelectedItems } from "@/lib/utils/deleteSelectedItems";
import useAuth from "@/hooks/useAuth";
import useAppContext from "@/hooks/useAppContext";

const generateColumns = ({ onViewClick, onEditClick, onDeleteClick }) => {
  const stateColors = {
    pending: "bg-blue-500",
    onprogress: "bg-yellow-200/60",
    completed: "bg-green-600/30",
    delivered: "bg-gray-200",
  };

  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "customer",
      header: "Customer Name",
      cell: ({ row }) => {
        const customer = row.getValue("customer");
        return (
          <p className="capitalize">
            {customer?.firstName + " " + customer?.lastName}
          </p>
        );
      },
    },
    {
      accessorKey: "s",
      header: "Items",
      cell: ({ row }) => {
        const services = row.getValue("servicesRendered");
        const items = [
          ...new Set(services.flatMap((service) => service?.serviceItem?.name)),
        ];
        return (
          <div className="flex items-center">
            {items?.map((item, index) =>
              iconDictionary[item?.toLowerCase()] ? (
                <img
                  key={index}
                  src={iconDictionary[item.toLowerCase()]}
                  alt={item}
                  width={20}
                />
              ) : (
                <p key={index} className="text-2xl">
                  📦
                </p>
              )
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Order Date",
      cell: ({ row }) => <p>{formatDate(row.getValue("createdAt"))}</p>,
    },
    {
      accessorKey: "servicesRendered",
      header: "Quantity",
      cell: ({ row }) => {
        const items = row.getValue("servicesRendered");
        let total = 0;
        for (let i of items) {
          total += i.quantity;
        }
        return <p>{total}</p>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const value = row.getValue("status");
        return (
          <div
            className={`capitalize w-fit py-2 px-3 rounded-md ${stateColors[value]}`}
          >
            {value === "onprogress" ? "in progress" : value}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const Order = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <DropdownMenuItem onClick={() => onViewClick(Order)}>
                View Order
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEditClick(Order)}>
                Edit Order
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDeleteClick(Order?._id)}>
                Delete Order
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};

export function OrdersTable({
  onViewClick,
  onEditClick,
  onDeleteClick,
  orders,
}) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const {
    auth: { accessToken },
  } = useAuth();

  const columns = generateColumns({ onViewClick, onEditClick, onDeleteClick });

  const table = useReactTable({
    data: orders,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const [selectedStatus, setSelectedStatus] = useState("Status");
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setAlert, triggerUpdate } = useAppContext();

  const handleDeleteAll = () => {
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setLoading(true);

    const selectedIds = table
      .getSelectedRowModel()
      .rows.map((row) => row.original._id);

    try {
      const { data, message } = await deleteSelectedItems(
        accessToken,
        "order",
        selectedIds
      );

      if (message) {
        setAlert((prev) => ({
          ...prev,
          message: message,
          type: "warning",
        }));
      }

      if (data) {
        setIsConfirmDialogOpen(false);
        setAlert((prev) => ({
          ...prev,
          message: "orders deleted successfully",
          type: "success",
        }));
        triggerUpdate("item");
      }
    } catch (error) {
      console.log("Error deleting orders: ", error);
      setAlert((prev) => ({
        ...prev,
        message: "Failed to delete orders",
        type: "error",
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[50rem] sm:w-full">
      <div className="flex items-center py-4 justify-between">
        <div className="flex items-center space-x-2">
          <div className="sm:block hidden">
            <ViewToggle />
          </div>
          <Button
            variant="destructive"
            disabled={table.getSelectedRowModel().rows.length === 0}
            onClick={handleDeleteAll}
          >
            Delete Selected
          </Button>
        </div>

        {/* Confirmation Dialog */}
        <div
          className={`${
            isConfirmDialogOpen ? "block" : "hidden"
          } fixed top-10 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-md z-20`}
        >
          {/* dialog header */}
          <div>
            <h3 className="bg-danger px-5 py-2 text-white text-center rounded-t-md">
              Delete Selected Data
            </h3>
            <p className="p-5">
              Deleting all selected data? This action cannot be reversed.
            </p>
          </div>

          {/* dialog footer */}
          <div className="p-5 flex items-center space-x-5">
            <Button
              variant="outline"
              onClick={() => {
                setIsConfirmDialogOpen(false);
                setAlert((prev) => ({
                  ...prev,
                  message: "",
                }));
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={loading}
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              {loading ? "Deleting..." : "Yes, Delete"}
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-5">
          <Input
            placeholder="Search customers..."
            value={table.getColumn("customer")?.getFilterValue() ?? ""}
            onChange={(event) =>
              table
                .getColumn("customer")
                ?.setFilterValue(event.target.value.toLowerCase())
            }
            className="max-w-48"
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                {selectedStatus} <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {["pending", "in progress", "completed", "delivered"]?.map(
                (status, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => {
                      setSelectedStatus(status);
                      table.getColumn("status")?.setFilterValue(status);
                    }}
                  >
                    {status}
                  </DropdownMenuItem>
                )
              )}
              <DropdownMenuItem
                onClick={() => {
                  setSelectedStatus("Status");
                  table.getColumn("status")?.setFilterValue(""); // Clear the filter to show all staff
                }}
              >
                Clear Filter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No orders data available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ArrowLeft />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ArrowRight />
          </Button>
        </div>
      </div>
    </div>
  );
}

OrdersTable.propTypes = {
  onViewClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  orders: PropTypes.array.isRequired,
};
