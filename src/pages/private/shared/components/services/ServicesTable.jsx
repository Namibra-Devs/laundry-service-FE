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
import useAppContext from "@/hooks/useAppContext";
import { formatDate } from "@/lib/utils/formatDate";
import { deleteSelectedItems } from "@/lib/utils/deleteSelectedItems";
import useAuth from "@/hooks/useAuth";

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
      header: "Service Name",
      cell: ({ row }) => (
        <div className="capitalize">
          {row.getValue("name") || "unavailable"}
        </div>
      ),
    },
    {
      accessorKey: "branch",
      header: "Branch",
      filterFn: (row, columnId, filterValue) => {
        const branch = row.getValue(columnId);
        return branch?._id === filterValue;
      },
      cell: ({ row }) => {
        const branch = row.getValue("branch");
        return <p>{branch ? branch?.name : "unavailable"}</p>;
      },
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
      accessorKey: "addBy",
      header: "Added By",
      filterFn: (row, columnId, filterValue) => {
        const person = row.getValue(columnId);
        return person?._id === filterValue;
      },
      cell: ({ row }) => {
        const person = row.getValue("addBy");
        return (
          <div className="capitalize">{person?.name || "unavailable"}</div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const service = row.original;

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
              <DropdownMenuItem onClick={() => onEditClick(service)}>
                Edit Service
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDeleteClick(service?._id)}>
                Delete Service
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};

export function ServicesTable({ onEditClick, onDeleteClick, services }) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const { branches, triggerUpdate } = useAppContext();
  const {
    auth: { accessToken },
  } = useAuth();

  const getBranchName = (branchId) => {
    const branch = branches.find((b) => b._id === branchId);
    return branch?.name || branchId;
  };

  // const uniqueBranchIds = Array.from(
  //   new Set(services.map((service) => service?.branch))
  // );

  const uniqueBranchIds = Array.from(
    services
      .reduce((map, service) => {
        if (service?.branch) {
          const branch = Array.isArray(service.branch)
            ? service.branch
            : [service.branch];
          branch.forEach((branchItem) => {
            if (branchItem?._id && !map.has(branchItem._id)) {
              map.set(branchItem._id, branchItem);
            }
          });
        }
        return map;
      }, new Map())
      .values()
  );

  const uniqueDates = Array.from(
    new Set(services.map((service) => service?.createdAt))
  );

  const uniquePersons = Array.from(
    services
      .reduce((map, service) => {
        if (service?.addBy) {
          const addBy = Array.isArray(service.addBy)
            ? service.addBy
            : [service.addBy];
          addBy.forEach((person) => {
            if (person?._id && !map.has(person._id)) {
              map.set(person._id, person);
            }
          });
        }
        return map;
      }, new Map())
      .values()
  );

  const columns = generateColumns({
    onEditClick,
    onDeleteClick,
    getBranchName,
  });

  const table = useReactTable({
    data: services,
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

  const [selectedBranch, setSelectedBranch] = useState("Branch");
  const [selectedAddedBy, setSelectedAddedBy] = useState("Added By");
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
        "service",
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
          message: "Services deleted successfully",
          type: "success",
        }));
        triggerUpdate("service");
      }
    } catch (error) {
      console.log("Error deleting services: ", error);
      setAlert((prev) => ({
        ...prev,
        message: "Failed to delete services",
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
            placeholder="Search names..."
            value={table.getColumn("name")?.getFilterValue() ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-48"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Date <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {uniqueDates?.map((date) => (
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                {selectedBranch} <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {uniqueBranchIds?.map((branchItem) => (
                <DropdownMenuItem
                  key={branchItem?._id}
                  onClick={() => {
                    setSelectedBranch(getBranchName(branchItem?.name));
                    table.getColumn("branch")?.setFilterValue(branchItem?._id);
                  }}
                >
                  {branchItem?.name}
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
                  key={person._id}
                  onClick={() => {
                    setSelectedAddedBy(person?.name);
                    table.getColumn("addBy")?.setFilterValue(person._id);
                  }}
                >
                  {person?.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem
                onClick={() => {
                  setSelectedAddedBy("Added By");
                  table.getColumn("addBy")?.setFilterValue(""); // Clear the filter
                }}
              >
                Clear Filter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          ;
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
                  No Services Data Available
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

ServicesTable.propTypes = {
  onEditClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  services: PropTypes.array.isRequired,
};
