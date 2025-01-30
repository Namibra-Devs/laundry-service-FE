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
import { formatDate } from "@/lib/utils/formatDate";
import useAppContext from "@/hooks/useAppContext";
import useAuth from "@/hooks/useAuth";
import { deleteSelectedItems } from "@/lib/utils/deleteSelectedItems";

const generateColumns = ({ onEditClick, onDeleteClick }) => {
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
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="capitalize">
          {row.getValue("name") || "unavailable"}
        </div>
      ),
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => (
        <div className="capitalize">
          {row.getValue("location") || "unavailable"}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date Created",
      cell: ({ row }) => (
        <div className="capitalize">
          {formatDate(row.getValue("createdAt")) || "unavailable"}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      filterFn: (row, columnId, filterValue) => {
        const status = row.getValue(columnId);
        return status.toLowerCase() === filterValue.toLowerCase(); // Case-insensitive match
      },
      cell: ({ row }) => {
        const value = row.getValue("status");
        return value ? (
          <div
            className={`capitalize w-fit py-2 px-3 rounded-md ${
              value === "active"
                ? "text-success bg-success/20"
                : "text-danger bg-danger/20"
            }`}
          >
            {value}
          </div>
        ) : (
          <div>unavailable</div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const branch = row.original;

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
              <DropdownMenuItem onClick={() => onEditClick(branch)}>
                Edit Branch
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDeleteClick(branch?._id)}>
                Delete Branch
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};

export function BranchTable({
  onEditClick,
  onDeleteClick,
  branches,
  locations,
  dates,
  isFetchLoading,
}) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const { triggerUpdate } = useAppContext();
  const {
    auth: { accessToken },
  } = useAuth();

  const columns = generateColumns({ onEditClick, onDeleteClick });

  const [globalFilter, setGlobalFilter] = useState("");

  const globalFilterFn = (row, columnId, filterValue) => {
    const name = row.original.name?.toLowerCase() ?? "";
    const location = row.original.location?.toLowerCase() ?? "";
    const searchValue = filterValue.toLowerCase();

    return name.includes(searchValue) || location.includes(searchValue);
  };

  const table = useReactTable({
    data: branches,
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

  const [selectedStatus, setSelectedStatus] = useState("Status");
  const [selectedLocation, setSelectedLocation] = useState("Location");
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setAlert } = useAppContext();

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
        "branch",
        selectedIds
      );

      if (message) {
        console.log(message);
        setAlert((prev) => ({
          ...prev,
          message: message,
          type: "warning",
        }));
      }

      if (data) {
        console.log("Data: ", data);
        setIsConfirmDialogOpen(false);
        setAlert((prev) => ({
          ...prev,
          message: "Data deleted successfully",
          type: "success",
        }));
        triggerUpdate("branch");
      }
    } catch (error) {
      console.log("Error deleting branches: ", error);
      setAlert((prev) => ({
        ...prev,
        message: "Failed to delete items",
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
              Deleting selected data? This action cannot be reversed.
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
            placeholder="Search name or location ..."
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-48"
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                {selectedLocation} <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {locations?.map((location, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={() => {
                    setSelectedLocation(location);
                    table.getColumn("location")?.setFilterValue(location);
                  }}
                >
                  {location}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem
                onClick={() => {
                  setSelectedLocation("Location");
                  table.getColumn("location")?.setFilterValue(""); // Clear the filter to show all staff
                }}
              >
                Clear Filter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                {selectedStatus} <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {["Active", "Inactive"].map((status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => {
                    setSelectedStatus(status);
                    table.getColumn("status")?.setFilterValue(status); // Sets the exact value
                  }}
                >
                  {status}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem
                onClick={() => {
                  setSelectedStatus("Status");
                  table.getColumn("status")?.setFilterValue(""); // Clear filter
                }}
              >
                Clear Filter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Date <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {dates?.map((date) => (
                <DropdownMenuItem
                  key={date}
                  onClick={() => {
                    table.getColumn("createdAt")?.setFilterValue(date);
                  }}
                >
                  {formatDate(date, true)}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem
                onClick={() => {
                  table.getColumn("createdAt")?.setFilterValue(""); // Clear the filter to show all staff
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
                  {isFetchLoading
                    ? "Fetching your Data"
                    : "No Branches Data Available"}
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

BranchTable.propTypes = {
  onEditClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  branches: PropTypes.array.isRequired,
  locations: PropTypes.array.isRequired,
  dates: PropTypes.array.isRequired,
  isFetchLoading: PropTypes.bool,
};
