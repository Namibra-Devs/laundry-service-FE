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
      accessorKey: "firstName",
      header: "Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("firstName")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        const email = row.getValue("email");
        return <div>{email.slice(0, email.indexOf("@") + 1) + "..."}</div>;
      },
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => <div>{row.getValue("phone")}</div>,
    },
    {
      accessorKey: "houseNumber",
      header: "House Number",
      cell: ({ row }) => <div>{row.getValue("houseNumber")}</div>,
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
        return branch?.name?.toLowerCase().includes(filterValue.toLowerCase());
      },
    },
    {
      accessorKey: "addedBy",
      header: "Added By",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("addedBy")}</div>
      ),
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

  const globalFilterFn = (row, columnId, filterValue) => {
    const name = row.original.firstName?.toLowerCase() ?? "";
    const email = row.original.email?.toLowerCase() ?? "";
    const phone = row.original.phone?.toLowerCase() ?? "";
    const houseNumber = row.original.houseNumber?.toLowerCase() ?? "";
    const searchValue = filterValue.toLowerCase();

    return (
      name.includes(searchValue) ||
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

  return (
    <div className="w-[50rem] sm:w-full">
      <div className="flex items-center py-4 justify-between">
        <div>...</div>
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
                  {branch?.name}
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
                  key={person}
                  onClick={() => {
                    setSelectedAddedBy(person);
                    table.getColumn("addedBy")?.setFilterValue(person);
                  }}
                >
                  {person}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem
                onClick={() => {
                  setSelectedAddedBy("Added By");
                  table.getColumn("addedBy")?.setFilterValue(""); // Clear the filter to show all staff
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
