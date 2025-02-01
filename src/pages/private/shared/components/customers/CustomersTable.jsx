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
import { deleteSelectedItems } from "@/lib/utils/deleteSelectedItems";
import useAuth from "@/hooks/useAuth";
import useAppContext from "@/hooks/useAppContext";

const generateColumns = ({ onViewClick, onEditClick, onDeleteClick }) => {
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
      accessorFn: (row) => {
        const firstName = row.firstName || "unavailable";
        const middleName = row.middleName || "-";
        const lastName = row.lastName || "-";
        return `${firstName} ${middleName} ${lastName}`;
      },
      id: "fullName",
      header: "Name",
      cell: ({ getValue }) => <div className="capitalize">{getValue()}</div>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        const email = row.getValue("email");
        return (
          <div>
            {email
              ? email.slice(0, email.indexOf("@") + 1) + "..."
              : "unavailable"}
          </div>
        );
      },
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => <div>{row.getValue("phone") || "unavailable"}</div>,
    },
    {
      accessorKey: "houseNumber",
      header: "House Number",
      cell: ({ row }) => (
        <div>{row.getValue("houseNumber") || "unavailable"}</div>
      ),
    },
    {
      accessorKey: "branch",
      header: "Branch",
      cell: ({ row }) => {
        const branch = row.getValue("branch");
        return <p>{branch?.name}</p>;
      },
      filterFn: (row, columnId, filterValue) => {
        const branch = row.getValue(columnId);
        return branch
          ? branch?.name?.toLowerCase().includes(filterValue.toLowerCase())
          : "unavailable";
      },
    },
    {
      accessorKey: "addedBy",
      header: "Added By",
      cell: ({ row }) => {
        const addedBy = row.getValue("addedBy");
        return (
          <div className="capitalize">{addedBy ? addedBy?.name : "admin"}</div>
        );
      },
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue) return true;
        const addedBy = row.getValue(columnId);
        return addedBy?.name === filterValue || addedBy === filterValue;
      },
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const customer = row.original;

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

              <DropdownMenuItem onClick={() => onViewClick(customer)}>
                View Customer
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEditClick(customer)}>
                Edit Customer
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDeleteClick(customer?._id)}>
                Delete Customer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};

export function CustomersTable({
  onViewClick,
  onEditClick,
  onDeleteClick,
  customers,
}) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const columns = generateColumns({ onViewClick, onEditClick, onDeleteClick });

  const [globalFilter, setGlobalFilter] = useState("");
  const {
    auth: { accessToken },
  } = useAuth();

  const globalFilterFn = (row, filterValue) => {
    const fullName = row.original.fullName?.toLowerCase() ?? "";
    const email = row.original.email?.toLowerCase() ?? "";
    const phone = row.original.phone?.toLowerCase() ?? "";
    const houseNumber = row.original.houseNumber?.toLowerCase() ?? "";
    const searchValue = filterValue.toLowerCase();

    return (
      fullName.includes(searchValue) ||
      email.includes(searchValue) ||
      phone.includes(searchValue) ||
      houseNumber.includes(searchValue)
    );
  };

  const uniqueBranches = Array.from(
    new Set(customers.map((customerItem) => customerItem?.branch?._id)).values()
  ).map(
    (branchId) =>
      customers.find((staff) => staff.branch._id === branchId).branch
  );

  const uniquePersons = Array.from(
    new Set(customers.map((customer) => customer?.addedBy))
  );

  const table = useReactTable({
    data: customers,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    globalFilterFn,
  });

  const [selectedBranch, setSelectedBranch] = useState("Branch");
  const [selectedAddedBy, setSelectedAddedBy] = useState("Added By");
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
        "customer",
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
          message: "Customers deleted successfully",
          type: "success",
        }));
        triggerUpdate("customer");
      }
    } catch (error) {
      console.log("Error deleting customers: ", error);
      setAlert((prev) => ({
        ...prev,
        message: "Failed to delete customers",
        type: "error",
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[50rem] sm:w-full">
      <div className="flex items-center py-4 justify-between">
        <Button
          variant="destructive"
          disabled={table.getSelectedRowModel().rows.length === 0}
          onClick={handleDeleteAll}
        >
          Delete Selected
        </Button>

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
              Deleting all selected data? This action cannot be reversed
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
            placeholder="Search name, email, phone and house-number ..."
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-48"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                {selectedBranch} <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {uniqueBranches?.map((branch) => (
                <DropdownMenuItem
                  key={branch?._id}
                  onClick={() => {
                    setSelectedBranch(branch?.name);
                    table.getColumn("branch")?.setFilterValue(branch?.name);
                  }}
                >
                  {branch?.name || "Admin"}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem
                onClick={() => {
                  setSelectedBranch("Branch");
                  table.getColumn("branch")?.setFilterValue(""); // Clear the filter to show all staff
                }}
              >
                Clear Filter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                {selectedAddedBy}
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {uniquePersons?.map((person) => (
                <DropdownMenuItem
                  key={`${person?._id}-${person?.name}`}
                  onClick={() => {
                    setSelectedAddedBy(person?.name);
                    table.getColumn("addedBy")?.setFilterValue(person?.name);
                  }}
                >
                  {person?.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem
                onClick={() => {
                  setSelectedAddedBy("Added By");
                  table.getColumn("addedBy")?.setFilterValue(null);
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
                  No customers data available
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

CustomersTable.propTypes = {
  onViewClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  customers: PropTypes.array.isRequired,
};
